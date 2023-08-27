terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region     = "eu-north-1"
}

// To Generate Private Key
resource "tls_private_key" "rsa_4096" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

variable "key_name" {
  description = "terraform-private-key"
}

// Create Key Pair for Connecting EC2 via SSH
resource "aws_key_pair" "key_pair" {
  key_name   = var.key_name
  public_key = tls_private_key.rsa_4096.public_key_openssh
}

// Save ssh fingerprint file locally
resource "local_file" "private_key" {
  content  = tls_private_key.rsa_4096.private_key_pem
  filename = var.key_name

  provisioner "local-exec" {
    command = "chmod 400 ${var.key_name}"
  }
}

// Create a security group * so we don't have to manually update on AWS
resource "aws_security_group" "sg3_ec2" {
  name        = "sg3_ec2"
  description = "Security group for Public EC2"

  // To Allow SSH Transport
  ingress {
    from_port = 22
    protocol = "tcp"
    to_port = 22
    cidr_blocks = ["0.0.0.0/0"]
  }

  // To Allow Port 80 Transport
  ingress {
    from_port = 80
    protocol = "tcp"
    to_port = 80
    cidr_blocks = ["0.0.0.0/0"]
  }

  // removed by default
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

// Creating a t3 micro instance
resource "aws_instance" "public_instance" {
  ami                    = "ami-0989fb15ce71ba39e"
  instance_type          = "t3.micro"
  key_name               = aws_key_pair.key_pair.key_name

  vpc_security_group_ids = [
    aws_security_group.sg3_ec2.id
  ]

  depends_on = [ aws_security_group.sg3_ec2 ]

  tags = {
    Name = "public_instance"
  }

  provisioner "local-exec" {
    command = "touch ec2_inventory.ini"
  }
}


data "template_file" "inventory" {
  template = <<-EOT
    [ec2_instances]
    ${aws_instance.public_instance.public_ip} ansible_user=ubuntu ansible_private_key_file=/mnt/c/Users/John/Desktop/rise/terraform-private-key
    EOT
}

resource "local_file" "ec2_inventory" {
  depends_on = [aws_instance.public_instance]

  filename = "ec2_inventory.ini"
  content  = data.template_file.inventory.rendered

  provisioner "local-exec" {
    command = "chmod 400 ${local_file.ec2_inventory.filename}"
  }
}

resource "null_resource" "run_ansible" {
  depends_on = [local_file.ec2_inventory]

  provisioner "local-exec" {
    command = "ansible-playbook -i ec2_inventory.ini setup-and-deploy-server.yaml"
    working_dir = "/mnt/c/Users/John/Desktop/rise"
  }
}
