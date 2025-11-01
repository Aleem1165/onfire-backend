export interface SanitizeOptions {
  keep?: string[];
  remove?: string[];
}

export interface JwtPayload {
  _id: string;
  email: string,
  role: string
}

export interface SendMailOptions {
  to: string;
  subject: string;
  otp: string;
  name: string
}

declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File;
      files?: { [fieldname: string]: Express.Multer.File[] };
    }
  }
}


declare global {
  namespace Express {
    interface Request {
      _id?: string;
      email?: string;
      role?: string;
    }
  }
}