const pool = require('../config/db');

exports.getExample = async (req, res, next) => {
    try {
      // Using async/await to query the database
      const [rows] = await pool.query('SELECT * FROM poets');
      
      // Send the result back to the client
      res.json({
        success: true,
        data: rows
      });
    } catch (error) {
      // Error handling
      console.error('Database query error:', error);
      res.status(500).json({
        success: false,
        message: 'Database query failed',
      });
    }
  };
// exports.getExample = (req, res) => {
//     res.json({
//       message: 'Hello from the Serverless Express API!',
//     });
//   };
exports.postExample = async (req, res) => {
    console.log(req.body);
    const { example } = req.body;
    try{
        if(!example){
            return res.status(400).json({ success: false, message: 'Please provide all fields:' });
        }

    // Insert the new user into the database using async/await
    const query = 'INSERT INTO poets (name) VALUES (?)';
    const [result] = await pool.execute(query, [example]);
    console.log(result);
     // Send success response
     res.status(201).json({
        success: true,
        message: 'data successfully received',
        poetId: result.insertId,
      });} catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            success: false,
            message: 'Server error, unable to create user',
          });
      }
    

};
  
// exports.postExample = (req, res) => {
//     console.log(req.body);
//     res.json({
//       message: 'Hello from the Serverless Express API!',
//     });
//   };
  