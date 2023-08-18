import { Request, Response, NextFunction } from 'express';

const dateParser = (req: Request, res: Response, next: NextFunction): Response | void => {
  const dateString: string | undefined | null = req.body.dob;

  // If dob is not sent in request body
  if (dateString == undefined) {
    next();
  }
  else {
    const dateComponents = dateString.split('/');

    // Invalid format
    if (dateComponents.length !== 3) {
      return res.status(400).json({ success: false, message: 'Invalid Date Format. The date should be in DD/MM/YYYY format' });
    }

    const day = parseInt(dateComponents[0]);
    const month = parseInt(dateComponents[1]) - 1; // Months are zero-based in JavaScript Date
    const year = parseInt(dateComponents[2]);
    console.log(day, month, year);

    // Invalid date values
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      return res.status(400).json({ success: false, message: 'Invalid Date Format. The date should be in DD/MM/YYYY format' });
    }

    const parsedDate = new Date(Date.UTC(year, month, day, 0, 0, 0));
    console.log(parsedDate);


    // Check if the parsed date is valid
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid Date!' });
    }

    req.body.dob = parsedDate;
    next();
  }
}

export default dateParser;