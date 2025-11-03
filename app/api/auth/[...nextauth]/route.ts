import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";

const prisma = new PrismaClient
const handler = NextAuth({
  providers: [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID ?? "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
  })
],
  callbacks : {
    async signIn(params){
      const userData = {
        id : params.user.id,
        email : params.user.email ,
        provider : "Google"
      }
      try{
        const result = await prisma.user.create({
        data : userData
      });
      }catch(e){
        console.log(e);
        return false ;
      }
      
      return true ;
    }
  }
})
// data we are getting : {
//   id: '102099283177021806449',
//   name: 'chirag mukhija',
//   email: 'ccclbbb1313@gmail.com',
//   image: 'https://lh3.googleusercontent.com/a/ACg8ocLKkzu_1Wa32_iHEWZNySor_X7Jnz0ifDNdgPOvFgd5pqMD388H=s96-c'
// }
export { handler as GET, handler as POST }