using EmployeeTaskApp.Models;
using EmployeeTaskApp.Utilities;
using System.Collections.Generic;

namespace EmployeeTaskApp.Repositories
{
    public interface IEmployeeTask
    {
        public JsonResponse GetEmpoyee(); 
        public JsonResponse SaveTaskDetail(ATTTask attemployeeTask);  
        public JsonResponse GetTaskDetailList();
        public JsonResponse GetTaskDetailListByID(int Task_Id);
        public JsonResponse DeleteTaskDetailByID(int Task_Id); 
    }
}
