// models/requestStateModel.js
const { databaseInstance, sql } = require("../config/dbConfig");

async function getAllRequestStates() {
  const pool = await databaseInstance.getConnection();
  const result = await pool.request().query('SELECT * FROM RequestState');
  return result.recordset;
}

async function getRequestStateById(RequestStateID) {
  const pool = await databaseInstance.getConnection();
  const result = await pool.request()
    .input('RequestStateID', sql.Int, RequestStateID)
    .query('SELECT * FROM RequestState WHERE RequestStateID = @RequestStateID');
  return result.recordset[0];
}

async function createRequestState(data) {
  const pool = await databaseInstance.getConnection();
  const result = await pool.request()
    .input('Name', sql.VarChar(50), data.Name)
    .input('Description', sql.Text, data.Description)
    .query(`INSERT INTO RequestState (Name, Description)
            VALUES (@Name, @Description);
            SELECT SCOPE_IDENTITY() AS RequestStateID`);
  return result.recordset[0];
}

async function updateRequestState(RequestStateID, data) {
  const pool = await databaseInstance.getConnection();
  await pool.request()
    .input('RequestStateID', sql.Int, RequestStateID)
    .input('Name', sql.VarChar(50), data.Name)
    .input('Description', sql.Text, data.Description)
    .query(`UPDATE RequestState
            SET Name = @Name, Description = @Description
            WHERE RequestStateID = @RequestStateID`);
  return getRequestStateById(RequestStateID);
}

async function deleteRequestState(RequestStateID) {
  const pool = await databaseInstance.getConnection();
  await pool.request()
    .input('RequestStateID', sql.Int, RequestStateID)
    .query('DELETE FROM RequestState WHERE RequestStateID = @RequestStateID');
  return { deleted: true };
}

module.exports = {
  getAllRequestStates,
  getRequestStateById,
  createRequestState,
  updateRequestState,
  deleteRequestState,
};
