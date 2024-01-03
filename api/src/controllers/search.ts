import { Request, Response } from "express"
import { db } from "../db";;
import { RowDataPacket } from "mysql2";

export const searchAll = (req: Request, res: Response) => {
  const { searchTerm } = req.body;

  // Query to search.
  const q = `SELECT DISTINCT title, image, username 
              FROM story
              WHERE title LIKE ?
              OR username LIKE ?`;
  const v = ["%" + searchTerm + "%", "%" + searchTerm + "%"];
  db.query(q, v, (error, data) => {
    // Error checking
    if (error) return res.status(500).json({ error });

    const typedData = data as RowDataPacket[];
    return res.status(200).json({ message: "Successfully fetched results.", data: typedData });
  });
}

export const searchStories = (req: Request, res: Response) => {
  const { searchTerm } = req.body;

  // Query to search.
  const q = `SELECT DISTINCT title, image, username 
              FROM story
              WHERE title LIKE ?`;
  const v = ["%" + searchTerm + "%"];
  db.query(q, v, (error, data) => {
    // Error checking
    if (error) return res.status(500).json({ error });

    const typedData = data as RowDataPacket[];
    return res.status(200).json({ message: "Successfully fetched story results.", data: typedData });
  });
}

export const searchUsers = (req: Request, res: Response) => {
  const { searchTerm } = req.body;

  // Query to search.
  const q = `SELECT DISTINCT title, image, username 
              FROM story
              WHERE username LIKE ?`;
  const v = ["%" + searchTerm + "%"];
  db.query(q, v, (error, data) => {
    // Error checking
    if (error) return res.status(500).json({ error });

    const typedData = data as RowDataPacket[];
    return res.status(200).json({ message: "Successfully fetched user results.", data: typedData });
  });
}

export const getSaved = (req: Request, res: Response) => {

}

export const getMonthlyTop = (req: Request, res: Response) => {

}

export const getYearlyTop = (req: Request, res: Response) => {

}

export const getNew= (req: Request, res: Response) => {

}