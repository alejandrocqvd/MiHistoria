import { Request, Response } from "express"
import { db } from "../db";;
import { RowDataPacket } from "mysql2";
import jwt, { JwtPayload } from "jsonwebtoken";

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
  try {
    // Get JWT.
    const token = req.cookies["access_token"];
    if (!token) return res.status(401).json({ error: "Access denied, no token provided." });
    
    // Verify the token and save username.
    const decoded = jwt.verify(token, "jwtkey") as JwtPayload;
    if (!decoded.username) return res.status(401).json({ error: "Invalid token." });
    const username = decoded.username;

    const page = req.body.data.page ? parseInt(req.body.data.page as string) : 1;
    const limit = req.body.data.limit ? parseInt(req.body.data.limit as string) : 50;

    // Offset for the query
    const offset = (page - 1) * limit;

    // Query to get the user's saved stories.
    const q = `SELECT DISTINCT st.title, st.image, st.username, sv.timestamp
                FROM story AS st
                LEFT JOIN saves AS sv ON st.username = sv.story_username
                WHERE sv.save_username = ? 
                ORDER BY sv.timestamp DESC
                LIMIT ?
                OFFSET ?`;
    db.query(q, [username, limit, offset], (error, data) => {
      if (error) return res.status(500).json({ error });

      const typedData = data as RowDataPacket[];
      return res.status(200).json({ message: "Successfully fetched saved stories.", data: typedData });
    });
  } catch (error) {
      res.status(400).json({ error: "Invalid token." });
  }
}

export const get5Saved = (req: Request, res: Response) => {
  try {
    // Get JWT.
    const token = req.cookies["access_token"];
    if (!token) return res.status(401).json({ error: "Access denied, no token provided." });
    
    // Verify the token and save username.
    const decoded = jwt.verify(token, "jwtkey") as JwtPayload;
    if (!decoded.username) return res.status(401).json({ error: "Invalid token." });
    const username = decoded.username;

    // Query to get 5 of the user's saved stories.
    const q = `SELECT DISTINCT st.title, st.image, st.username, sv.timestamp
                FROM story AS st
                LEFT JOIN saves AS sv ON st.username = sv.story_username
                WHERE sv.save_username = ? 
                ORDER BY sv.timestamp DESC
                LIMIT 5`;
    db.query(q, [username], (error, data) => {
      if (error) return res.status(500).json({ error });

      const typedData = data as RowDataPacket[];
      return res.status(200).json({ message: "Successfully fetched 5 saved stories.", data: typedData });
    });
  } catch (error) {
      res.status(400).json({ error: "Invalid token." });
  }
}

export const getSavedCount = (req: Request, res: Response) => {
  try {
    // Get JWT.
    const token = req.cookies["access_token"];
    if (!token) return res.status(401).json({ error: "Access denied, no token provided." });
    
    // Verify the token and save username.
    const decoded = jwt.verify(token, "jwtkey") as JwtPayload;
    if (!decoded.username) return res.status(401).json({ error: "Invalid token." });
    const username = decoded.username;

    // Query to get the number of posts saved by the user.
    const q = `SELECT COUNT(*) AS count
                FROM saves
                WHERE save_username = ?`;
    db.query(q, [username], (error, data) => {
      if (error) return res.status(500).json({ error });

      const typedData = data as RowDataPacket[];
      return res.status(200).json({ message: "Successfully fetched number of stories saved by user.", data: typedData[0] });
    });
  } catch (error) {
      res.status(400).json({ error: "Invalid token." });
  }
}

export const getMonthlyTop = (req: Request, res: Response) => {
  const page = req.body.page ? parseInt(req.body.page as string) : 1;
  const limit = req.body.limit ? parseInt(req.body.limit as string) : 50;

  // Offset for the query
  const offset = (page - 1) * limit;

  // Query to get top posts in the last 30 days.
  const q = `SELECT DISTINCT s.title, s.image, s.username, COUNT(l.story_username) AS like_count
              FROM story AS s
              LEFT JOIN likes AS l ON s.username = l.story_username
              WHERE s.timestamp >= NOW() - INTERVAL 30 DAY
              GROUP BY s.title, s.image, s.username
              ORDER BY like_count DESC
              LIMIT ?
              OFFSET ?`;
  db.query(q, [limit, offset], (error, data) => {
    if (error) return res.status(500).json({ error });

    const typedData = data as RowDataPacket[];
    return res.status(200).json({ message: "Successfully fetched top monthly stories.", data: typedData });
  });
}

export const get5MonthlyTop = (req: Request, res: Response) => {
  // Query to get 5 top posts in the last 30 days.
  const q = `SELECT DISTINCT s.title, s.image, s.username, COUNT(l.story_username) AS like_count
              FROM story AS s
              LEFT JOIN likes AS l ON s.username = l.story_username
              WHERE s.timestamp >= NOW() - INTERVAL 30 DAY
              GROUP BY s.title, s.image, s.username
              ORDER BY like_count DESC
              LIMIT 5`;
  db.query(q, (error, data) => {
    if (error) return res.status(500).json({ error });

    const typedData = data as RowDataPacket[];
    return res.status(200).json({ message: "Successfully fetched 5 top monthly stories.", data: typedData });
  });
}

export const getMonthlyCount = (req: Request, res: Response) => {
  // Query to get the number of posts made in the past month.
  const q = `SELECT COUNT(*) AS count
              FROM story AS s
              WHERE s.timestamp >= NOW() - INTERVAL 30 DAY`;
  db.query(q, (error, data) => {
    if (error) return res.status(500).json({ error });

    const typedData = data as RowDataPacket[];
    return res.status(200).json({ message: "Successfully fetched number of stories made in past 30 days.", data: typedData[0] });
  });
}

export const getYearlyTop = (req: Request, res: Response) => {
  const page = req.body.page ? parseInt(req.body.page as string) : 1;
  const limit = req.body.limit ? parseInt(req.body.limit as string) : 50;

  // Offset for the query
  const offset = (page - 1) * limit;

  // Query to get top posts in the last year.
  const q = `SELECT DISTINCT s.title, s.image, s.username, COUNT(l.story_username) AS like_count
              FROM story AS s
              LEFT JOIN likes AS l ON s.username = l.story_username
              WHERE s.timestamp >= NOW() - INTERVAL 1 YEAR
              GROUP BY s.title, s.image, s.username
              ORDER BY like_count DESC
              LIMIT ?
              OFFSET ?`;
  db.query(q, [limit, offset], (error, data) => {
    if (error) return res.status(500).json({ error });

    const typedData = data as RowDataPacket[];
    return res.status(200).json({ message: "Successfully fetched top yearly stories.", data: typedData });
  });
}

export const get5YearlyTop = (req: Request, res: Response) => {
  // Query to get 5 top posts in the last year.
  const q = `SELECT DISTINCT s.title, s.image, s.username, COUNT(l.story_username) AS like_count
              FROM story AS s
              LEFT JOIN likes AS l ON s.username = l.story_username
              WHERE s.timestamp >= NOW() - INTERVAL 1 YEAR
              GROUP BY s.title, s.image, s.username
              ORDER BY like_count DESC
              LIMIT 5`;
  db.query(q, (error, data) => {
    if (error) return res.status(500).json({ error });

    const typedData = data as RowDataPacket[];
    return res.status(200).json({ message: "Successfully fetched 5 top yearly stories.", data: typedData });
  });
}

export const getYearlyCount = (req: Request, res: Response) => {
  // Query to get the number of posts made in the past year.
  const q = `SELECT COUNT(*) AS count
              FROM story AS s
              WHERE s.timestamp >= NOW() - INTERVAL 1 YEAR`;
  db.query(q, (error, data) => {
    if (error) return res.status(500).json({ error });

    const typedData = data as RowDataPacket[];
    return res.status(200).json({ message: "Successfully fetched number of stories made in past year.", data: typedData[0] });
  });
}

export const getAllTimeTop = (req: Request, res: Response) => {
  const page = req.body.page ? parseInt(req.body.page as string) : 1;
  const limit = req.body.limit ? parseInt(req.body.limit as string) : 50;

  // Offset for the query
  const offset = (page - 1) * limit;

  // Query to get top 100 posts of all time.
  const q = `SELECT DISTINCT s.title, s.image, s.username, COUNT(l.story_username) AS like_count
              FROM story AS s
              LEFT JOIN likes AS l ON s.username = l.story_username
              GROUP BY s.title, s.image, s.username
              ORDER BY like_count DESC
              LIMIT ?
              OFFSET ?`;
  db.query(q, [limit, offset], (error, data) => {
    if (error) return res.status(500).json({ error });

    const typedData = data as RowDataPacket[];
    return res.status(200).json({ message: "Successfully fetched top stories of all time.", data: typedData });
  });
}

export const get5AllTimeTop = (req: Request, res: Response) => {
  // Query to get top 5 posts of all time.
  const q = `SELECT DISTINCT s.title, s.image, s.username, COUNT(l.story_username) AS like_count
              FROM story AS s
              LEFT JOIN likes AS l ON s.username = l.story_username
              GROUP BY s.title, s.image, s.username
              ORDER BY like_count DESC
              LIMIT 5`;
  db.query(q, (error, data) => {
    if (error) return res.status(500).json({ error });

    const typedData = data as RowDataPacket[];
    return res.status(200).json({ message: "Successfully fetched top 5 stories of all time.", data: typedData });
  });
}

export const getAllCount = (req: Request, res: Response) => {
  // Query to get the number of posts made for all time.
  const q = `SELECT COUNT(*) AS count
              FROM story AS s`;
  db.query(q, (error, data) => {
    if (error) return res.status(500).json({ error });

    const typedData = data as RowDataPacket[];
    return res.status(200).json({ message: "Successfully fetched total number of stories made.", data: typedData[0] });
  });
}

export const getNew = (req: Request, res: Response) => {
  const page = req.body.page ? parseInt(req.body.page as string) : 1;
  const limit = req.body.limit ? parseInt(req.body.limit as string) : 50;

  // Offset for the query
  const offset = (page - 1) * limit;

  // Query to get new stories.
  const q = `SELECT DISTINCT title, image, username, timestamp
              FROM story
              ORDER BY timestamp DESC
              LIMIT ?
              OFFSET ?`;
  db.query(q, [limit, offset], (error, data) => {
    if (error) return res.status(500).json({ error });

    const typedData = data as RowDataPacket[];
    return res.status(200).json({ message: "Successfully fetched new stories.", data: typedData });
  });
}

export const get5New = (req: Request, res: Response) => {
  // Query to get 5 new stories.
  const q = `SELECT DISTINCT title, image, username, timestamp
              FROM story
              ORDER BY timestamp DESC
              LIMIT 5`;
  db.query(q, (error, data) => {
    if (error) return res.status(500).json({ error });

    const typedData = data as RowDataPacket[];
    return res.status(200).json({ message: "Successfully fetched 5 newest stories.", data: typedData });
  });
}