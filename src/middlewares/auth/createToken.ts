import jwt from 'jsonwebtoken';

const createToken = (userId: number) => {
    const secret: any = process.env.TOKEN_SECRET;
    const expiresIn: string = '2d';

    const token = jwt.sign(
      { id: userId },
      secret,
      { expiresIn }
    );

    return token;
};
  
export default createToken;