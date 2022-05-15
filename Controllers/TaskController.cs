using EmployeeTaskApp.Models;
using EmployeeTaskApp.Repositories;
using EmployeeTaskApp.Utilities;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace EmployeeTaskApp.Controllers
{
    /**
     * Class that manages tasks
     */
    [Controller]
    [Route("Task")]
    public class TaskController : Controller
    {
        /**
         * Employee Task Reposiroty Instance
         */
        private readonly IEmployeeTask _EmployeeTaskRepository;
        public TaskController(IEmployeeTask EmployeeTaskRepository)
        {
            this._EmployeeTaskRepository = EmployeeTaskRepository;
        }

        /**
         * Method that loads task index page
         */
        [HttpGet]
        [ApiExplorerSettings(IgnoreApi = true)]
        public IActionResult Index()
        {
            return View();
        }

        /**
         * Method that fetches employee list
         */
        [HttpGet("GetEmpoyee")]
        public IActionResult GetEmpoyee()
        {
            return Ok(_EmployeeTaskRepository.GetEmpoyee());
        }

        /**
         * Method that Save and Update Task Details 
         */
        [HttpPost("SaveTaskDetail")]
        public IActionResult SaveTaskDetail(ATTTask attemployeeTask)
        {
            return Ok(_EmployeeTaskRepository.SaveTaskDetail(attemployeeTask));           
        }

        /**
         * Method that  fetches  list of task
         */
        [HttpGet("GetTaskDetailList")]
        public IActionResult GetTaskDetailList()  
        {
            return Ok(_EmployeeTaskRepository.GetTaskDetailList());
        }

        /**
         *  Method that fetches Task Detail by  ID
         */
        [HttpPost("GetTaskDetailListByID")]
        public IActionResult GetTaskDetailListByID(int Task_Id) 
        {
            return Ok(_EmployeeTaskRepository.GetTaskDetailListByID(Task_Id));
        }

        /**
         * Method that Delete Task Detail By ID
         */
        [HttpPost("DeleteTaskDetailByID")]
        public IActionResult DeleteTaskDetailByID(int Task_Id)
        {
            return Ok(_EmployeeTaskRepository.DeleteTaskDetailByID(Task_Id));
        }

    }
}
