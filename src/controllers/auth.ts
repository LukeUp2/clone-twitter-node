import { RequestHandler } from "express";
import { signupSchema } from "../schemas/signup";
import {
  createNewUser,
  findUserByEmail,
  findUserBySlug,
} from "../services/user";
import slug from "slug";
import { compare, hash } from "bcrypt-ts";
import { createJWT } from "../utils/jwt";
import { signinSchema } from "../schemas/signin";

export const signup: RequestHandler = async (req, res) => {
  // validar os dados recebidos
  const safeData = signupSchema.safeParse(req.body);
  if (!safeData.success) {
    return res.json({ error: safeData.error.flatten().fieldErrors });
  }

  // verificar email
  const hasEmail = await findUserByEmail(safeData.data.email);
  if (hasEmail) {
    return res.json({ error: "Email já cadastrado" });
  }

  // verificar e criar slug diferente para todos os usuários (joao, joao1029, joao20202)
  let genSlug = true;
  let userSlug = slug(safeData.data.name);
  while (genSlug) {
    const hasSlug = await findUserBySlug(userSlug);
    if (hasSlug) {
      let slugSufix = Math.floor(Math.random() * 999999).toString();
      userSlug = slug(safeData.data.name + slugSufix);
    } else {
      genSlug = false;
    }
  }

  // gerar hash de senha
  const hashPassword = await hash(safeData.data.password, 10);

  // criar o usuário
  const newUser = await createNewUser({
    slug: userSlug,
    name: safeData.data.name,
    email: safeData.data.email,
    password: hashPassword,
  });

  // criar o token
  const token = createJWT(userSlug);

  // retorna o resultado (token, usuario)
  res.status(201).json({
    token,
    user: {
      name: newUser.name,
      slug: newUser.slug,
      avatar: newUser.avatar,
    },
  });
};

export const signin: RequestHandler = async (req, res) => {
  const safeData = signinSchema.safeParse(req.body);
  if (!safeData.success) {
    return res.json({ error: safeData.error.flatten().fieldErrors });
  }

  const user = await findUserByEmail(safeData.data.email);
  if (!user) return res.status(401).json({ error: "Acesso negado" });

  const verifyPassword = await compare(safeData.data.password, user.password);
  if (!verifyPassword) return res.status(401).json({ error: "Acesso negado" });

  const token = createJWT(user.slug);

  res.status(200).json({
    token,
    user: {
      name: user.name,
      slug: user.slug,
      avatar: user.avatar,
    },
  });
};
