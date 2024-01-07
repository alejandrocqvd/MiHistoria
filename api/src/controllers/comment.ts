/**
 * Comment Module
 * 
 * This module provides the necessary functions for handling all 
 * comment/commenting functionalities.
 * 
 * Author: Alejandro Cardona
 * Date: 2024-01-06
 */

import { Request, Response } from "express";
import { db } from "../db";
import jwt, { JwtPayload } from "jsonwebtoken";
import { RowDataPacket } from "mysql2";

/**
 * Fetches the number of comments on a given story.
 * 
 * @param {Request} req - Contains a specified story's username.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns {Response} A response to the client with either a success or error message.
 */
export const getCommentCount = (req: Request, res: Response) => {
  const { story_username } = req.body;

  // Query to get the comments and their information
  const q = `SELECT COUNT(*) AS count
              FROM comment
              WHERE story_username = ?`;
  db.query(q, [story_username], (error, data) => {
      if (error) return res.status(500).json({ error });

      const typedData = data as RowDataPacket[];
      return res.status(200).json({ message: "Successfully fetched story comment count.", data: typedData[0] });
  });
}

/**
 * Fetches comments on a story
 * 
 * @param {Request} req - Contains the story's username, the current comment page, and the limit for each page.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns {Response} A response to the client with either a success or error message.
 */
export const getComments = (req: Request, res: Response) => {
  const { story_username } = req.body;
  const page = req.body.page ? parseInt(req.body.page as string) : 1;
  const limit = req.body.limit ? parseInt(req.body.limit as string) : 50;

  // Offset for the query
  const offset = (page - 1) * limit;

  // Query to get the comments and their information
  const q = `SELECT c.comment_id, c.comment_username AS username, c.text, c.timestamp, u.first_name, u.last_name, u.image 
              FROM comment AS c LEFT JOIN user AS u ON comment_username = username
              WHERE story_username = ?
              ORDER BY c.timestamp DESC
              LIMIT ?
              OFFSET ?`;
  db.query(q, [story_username, limit, offset], (error, data) => {
      if (error) return res.status(500).json({ error });

      const typedData = data as RowDataPacket[];
      return res.status(200).json({ message: "Successfully fetched story comments.", data: typedData });
  });
}

/**
 * Handles comment creation
 * 
 * @param {Request} req - Contains the comment author's JWT, story's username, and comment text content.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns {Response} A response to the client with either a success or error message.
 */
export const createComment = (req: Request, res: Response) => {
  const { story_username, text } = req.body.data;

  try {
      // Get JWT
      const token = req.cookies["access_token"];
      if (!token) return res.status(401).json({ error: "Access denied, no token provided." });
      
      // Verify the token and save username
      const decoded = jwt.verify(token, "jwtkey") as JwtPayload;
      if (!decoded.username) return res.status(401).json({ error: "Invalid token." });
      const username = decoded.username;

      // Query to create the comment
      const q = `INSERT INTO comment (comment_username, story_username, text)
                  VALUES (?, ?, ?)`;
      db.query(q, [username, story_username, text], (error) => {
          if (error) return res.status(500).json({ error });

          return res.status(201).json({ message: "Successfully created comment." });
      });
  } catch (error) {
      res.status(400).json({ error: "Invalid token." });
  }
}

/**
 * Handles comment deletion
 * 
 * @param {Request} req - Contains the comment author's JWT, comment's identification number.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns {Response} A response to the client with either a success or error message.
 */
export const deleteComment = (req: Request, res: Response) => {
  const { comment_id, comment_username } = req.body;

  try {
      // Get JWT
      const token = req.cookies["access_token"];
      if (!token) return res.status(401).json({ error: "Access denied, no token provided." });
      
      // Verify the token and save username
      const decoded = jwt.verify(token, "jwtkey") as JwtPayload;
      if (!decoded.username) return res.status(401).json({ error: "Invalid token." });
      const username = decoded.username;

      // Check if user's username and comment's author don't match
      if ( username !== comment_username ) return res.status(401).json({ error: "Unauthorized request. User cannot delete this comment." });

      // Query to delete the comment
      const q = `DELETE FROM comment WHERE comment_id = ?`;
      db.query(q, [comment_id], (error) => {
        if (error) return res.status(500).json({ error });

        return res.status(200).json({ message: "Successfully deleted comment." });
      });
  } catch (error) {
      res.status(400).json({ error: "Invalid token." });
  }
}