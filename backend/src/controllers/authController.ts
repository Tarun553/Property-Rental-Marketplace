import { Request, Response } from "express";
import User from "../models/User.js";
import { IUser, DecodedToken } from "../types/index.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/auth.js";
import { registerSchema, loginSchema } from "../validators/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const validation = registerSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ errors: validation.error.format() });
  }

  const { email, password, role, profile } = validation.data;
  console.log(email, password, role, profile);

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create({
    email,
    password,
    role,
    profile,
  });

  const accessToken = generateAccessToken(user._id.toString(), user.role);
  const refreshToken = generateRefreshToken(user._id.toString());

  user.refreshToken = refreshToken;
  await user.save();

  res.status(201).json({
    _id: user._id,
    email: user.email,
    role: user.role,
    profile: user.profile,
    accessToken,
    refreshToken,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const validation = loginSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ errors: validation.error.format() });
  }

  const { email, password } = validation.data;

  const user = (await User.findOne({ email })) as IUser | null;
  if (user && (await user.matchPassword(password))) {
    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString());

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      _id: user._id,
      email: user.email,
      role: user.role,
      profile: user.profile,
      accessToken,
      refreshToken,
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    const decoded = verifyRefreshToken(refreshToken) as DecodedToken;
    const user = (await User.findById(decoded.id)) as IUser | null;

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const newRefreshToken = generateRefreshToken(user._id.toString());

    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const user = await User.findOne({ refreshToken });

  if (user) {
    user.refreshToken = undefined;
    await user.save();
  }

  res.json({ message: "Logged out successfully" });
});
