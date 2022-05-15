
using System.ComponentModel.DataAnnotations;

namespace EmployeeTaskApp.Models
{
  public  class ATTTask
    {

        [Required]
        public int Emp_ID { get; set; }
        public int? Task_Id { get; set; }
        public string Employee_Name { get; set; }
        [Required]
        public string Task_Title { get; set; }
        [Required]
        public string Task_Status { get; set; }
        [Required]
        public string Description { get; set; }   
    }
}
