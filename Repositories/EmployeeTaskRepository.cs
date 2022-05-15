
using Dapper;
using EmployeeTaskApp.Models;
using EmployeeTaskApp.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;


namespace EmployeeTaskApp.Repositories
{
    /**
     * Repository class that manages all the Database Level operations for task
     */
   public class EmployeeTaskRepository : IEmployeeTask
    {
        // Dapper Context Instance
        private readonly DapperContext _context;
        public EmployeeTaskRepository(DapperContext context)
        {
            _context = context;
        }
       
        /**
         * Method that fetches Employee List 
         */
        public JsonResponse GetEmpoyee()
        {
            JsonResponse response = new JsonResponse();
            using (var connection = _context.CreateConnection())
            {
                try
                {
                    List<ATTEmployee> employees = connection.Query<ATTEmployee>("spGetEmployee", commandType: CommandType.StoredProcedure).ToList();
                    response.ResponseData = employees;
                    response.IsSuccess = true;
                    response.Message = "Employee Data fetched successfully";
                }catch (Exception ex) {
                    response.IsSuccess = false;
                    response.Message = ex.Message;
                }
            }
            return response;
        }

        /**
         * Method that fetches Task List 
         */
        public JsonResponse GetTaskDetailList()
        {
            JsonResponse response = new JsonResponse();
            using (var connection = _context.CreateConnection())
            {
                try { 
                    List<ATTTask> aTTEmployee = connection.Query<ATTTask>("spGetTaskDetailList", commandType: CommandType.StoredProcedure).ToList();
                    response.ResponseData = aTTEmployee;
                    response.IsSuccess = true;
                    response.Message = "Task List data fetched successfully";
                }catch(Exception ex)
                {
                    response.IsSuccess = false;
                    response.Message = ex.Message;
                }
            }
            return response;
        }

        /**
         * Method that fetches List of Task By ID
         */
        public JsonResponse GetTaskDetailListByID(int Task_Id)
        {
            JsonResponse response = new JsonResponse();
            using (var connection = _context.CreateConnection())
            {
                try
                {
                    DynamicParameters param = new DynamicParameters();
                    param.Add("@Task_Id", Task_Id);
                    List<ATTTask> attgetdata = connection.Query<ATTTask>("spGetTaskDetailListByID", param: param, null, commandType: CommandType.StoredProcedure)?.ToList();
                    if (attgetdata.Count > 0)
                    {
                        response.ResponseData = attgetdata;
                        response.IsSuccess = true;
                        response.Message = "Task List Data fetched successfully";
                    }
                    else
                    {
                        response.Message = "Record Not Found";
                    }
                }catch (Exception ex)
                {
                    response.IsSuccess = false;
                    response.Message = ex.Message;
                }
            }
            return response;
        }

        /**
         * Method tha Save and Update Task Details
         */
        public JsonResponse SaveTaskDetail(ATTTask attemployeeTask)
        {
            JsonResponse response = new JsonResponse();           
          
            using (var connection = _context.CreateConnection())
            {
                try { 
                    String spName = "";
                    if (attemployeeTask.Task_Id == null)
                    {
                        spName = "spSaveTaskDetail";
                        DynamicParameters param1 = new DynamicParameters();
                        param1.Add("Emp_ID", attemployeeTask.Emp_ID);
                        param1.Add("Task_Title", attemployeeTask.Task_Title);
                        param1.Add("Task_Status", attemployeeTask.Task_Status);
                        param1.Add("Description", attemployeeTask.Description);
                        connection.Query<JsonResponse>(spName, param1, commandType: CommandType.StoredProcedure).FirstOrDefault();
                        response.IsSuccess = true;
                        response.Message = "Successfully Saved !!!";
                    }
                    else
                    {
                        spName = "spUpdateTaskDetail";
                        DynamicParameters param1 = new DynamicParameters();
                        param1.Add("Task_Id", attemployeeTask.Task_Id);
                        param1.Add("Emp_ID", attemployeeTask.Emp_ID);
                        param1.Add("Task_Title", attemployeeTask.Task_Title);
                        param1.Add("Task_Status", attemployeeTask.Task_Status);
                        param1.Add("Description", attemployeeTask.Description);
                        connection.Query<JsonResponse>(spName, param1, commandType: CommandType.StoredProcedure).FirstOrDefault();
                        response.IsSuccess = true;
                        response.Message = "Successfully Update !!!";
                    }
                }catch (Exception ex)
                {
                    response.IsSuccess = false;
                    response.Message = ex.Message;
                }
            }
            return response;
        }

        /**
         * Method that Delate Task Detail By ID
         */
        public JsonResponse DeleteTaskDetailByID(int Task_Id)
        {
            JsonResponse response = new JsonResponse();
            string spName = "";
            using (var connection = _context.CreateConnection())
            {
                try { 
                    spName = "spDeleteTaskDetail";
                    DynamicParameters param1 = new DynamicParameters();
                    param1.Add("Task_Id", Task_Id);
                    connection.Query<JsonResponse>(spName, param1, commandType: CommandType.StoredProcedure).FirstOrDefault();
                    response.IsSuccess = true;
                    response.Message = "Successfully Delete !!!";
                }catch (Exception ex)
                {
                    response.IsSuccess = false;
                    response.Message = ex.Message;
                }
            }
            return response;
        }
    }
}
