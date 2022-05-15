function EmployeeData(data) {
    var self = this;
    if (data != undefined) {
        self.Emp_ID = ko.observable(data.Emp_ID);
        self.Employee_Name = ko.observable(data.Employee_Name);
        self.Status = ko.observable(data.Status);
     
    }
}

function TaskDetailList(data) {
    var self = this;
    if (data != undefined) {
        self.Emp_ID = ko.observable(data.Emp_ID);
        self.Employee_Name = ko.observable(data.Employee_Name);
        self.Task_Title = ko.observable(data.Task_Title);
        self.Description = ko.observable(data.Description);
        self.Task_Status = ko.observable(data.Task_Status);
        self.Task_Id = ko.observable(data.Task_Id); 
    }
}


/*
 * View Model that hold the UI's data
 */ 
var EmployeeTaskViewModel = function () {

    self.EmployeeDatas = ko.observableArray([]);
    self.SelectedEmployeeID = ko.observable();
    self.Task_Title = ko.observable();
    self.Task_Status = ko.observable();
    self.StatusOptions = ko.observableArray([
        { StatusName: 'New' },
        { StatusName: 'Active' },
        { StatusName: 'Resolved' },
        { StatusName: 'Closed' }
    ]);
    self.Description = ko.observable();
    self.SelectedTask_Id = ko.observable();
    self.Emp_ID = ko.observable();
    self.Task_Id = ko.observable();
    self.TaskDetailLists = ko.observableArray([]);
    self.Employee_Name = ko.observable();

    /*
     * Method that call Ajax for fetches Employee List
    */
    self.GetEmployeeData = function () {
        $.ajax({
            url: '/Task/GetEmpoyee',
            success: function (result) {
                if (result.IsSuccess) {
                    let data = result.ResponseData;
                    var mappedTasks = $.map(data, function (item) {
                        return new EmployeeData(item)
                    });
                    mappedTasks = ko.toJS(mappedTasks);
                    self.EmployeeDatas(mappedTasks);
                }
            },
            error: function (error) {
                console.log("failed", error)
            }
        });
    }
    self.GetEmployeeData();

    /*
     * Method that call Ajax for fetches Task List
   */ 
    self.GetTaskDetailList = function () {
        $.ajax({
            url: '/Task/GetTaskDetailList',
            success: function (result) {
                if (result.IsSuccess) {
                    let data = result.ResponseData;
                    var mappedTasks = $.map(data, function (item) {
                        return new TaskDetailList(item)
                    });
                    mappedTasks = ko.toJS(mappedTasks);
                    self.TaskDetailLists(mappedTasks);
                    //InitializeDataTable();
                }
            },
            error: function (error) {
                console.log("failed", error)
            }
        });
    }
    self.GetTaskDetailList();
    /*
     * Function for Validation of Form
    */
    self.Validation = function () {
        var errMsg = "";
        if (ko.toJS(self.SelectedEmployeeID()) == undefined || self.SelectedEmployeeID() == '') {
            errMsg += " Select Employee Name !!!<br/>";
        }
        if (ko.toJS(self.Task_Status()) == undefined || self.Task_Status().trim() == '') {
            errMsg += "Select  Status  !!!<br/>";
        }
        if (ko.toJS(self.Task_Title()) == undefined || self.Task_Title().trim() == '') {
            errMsg += "Enter Task Title !!!<br/>";
        }      
        if (ko.toJS(self.Description()) == undefined || self.Description().trim() == '') {
            errMsg += "Enter Description !!!";
        }  
        if (errMsg !== "") {
            toastr.error(errMsg, "ERROR");
            return false;
        }
        else {
            return true;
        }
    }
    /*
     * Function  that call Ajax for Save  and Update
    */
    self.SaveTaskDetail = function () { 
        if(!self.Validation()) return;
        var TaskDetail = {
            Task_Id: self.Task_Id(),
            Emp_ID: self.SelectedEmployeeID, 
            Task_Title: self.Task_Title(),
            Task_Status: self.Task_Status(),
            Description: self.Description()          
        }
        var url = '/Task/SaveTaskDetail';
        var data = { attemployeeTask: TaskDetail };
        $.post(url, data, function (res, status, xhr) {
            var obj = res;
            if (obj.IsSuccess) {
                toastr.success(obj.Message);
                self.ClearControls();
                self.GetTaskDetailList();
                $("#SaveEditTask").text('Save');
            }      
         else {
        self.ClearControls();
        alert('error', "Not Responding Please Try Later");
        self.ClearControls();
       }
        }).fail((xhr, status, message) => {
            jAlert(status, message);
        });
    }

    /*
     * Function that call POST method to fetch Task Detail By ID
    */

    self.EditEmployeeTaskDetail = function (data) {       
        var Task_Id = data.Task_Id;
        $("#SaveEditTask").text('Update');
        if (Task_Id == null) return;
        var url = '/Task/GetTaskDetailListByID';
        var data = { 'Task_Id': Task_Id };
        $.post(url, data, function (res, status, xhr) {

            var obj = res;
            if (obj.IsSuccess) {
                var data = obj.ResponseData[0];
                console.log(data);
                self.Task_Id(data.Task_Id); 
                self.SelectedEmployeeID(data.Emp_ID); 
                self.Task_Title(data.Task_Title);
                self.Description(data.Description);
                self.Task_Status(data.Task_Status);
            }
            else {
                alert('error', "Not Responding Please Try Later");
            }

        }).fail((xhr, status, message) => {
            jAlert(status, message);

        });
        
    };

    /*
     * Function that call POST Method to delete task List by ID
    */
    self.DeleteEmployeeTaskDetail = function (data) {
        let conf = confirm("Are you sure to delete?");
        if (!conf) return;
        var Task_Id = data.Task_Id;
        if (Task_Id == null) return;
        var url = '/Task/DeleteTaskDetailByID';
        var data = { 'Task_Id': Task_Id };
        $.post(url, data, function (res, status, xhr) {

            var obj = res;
            if (obj.IsSuccess) {
                toastr.success(obj.Message);
                self.GetTaskDetailList();
            }
        });
    }


    /*
     * To clear form fill data
    */
    self.ClearControls = function () {
        self.SelectedEmployeeID(null);
        self.Task_Title(null);
        self.Task_Status(null);
        self.Description(null);
    }

    self.CancelTaskDetail = function () {
        self.ClearControls();
        $("#SaveEditTask").text('Save');
    }

}

$(document).ready(function () {
    /*
     * Activate Knockout JavaScript
    */
    ko.applyBindings(new EmployeeTaskViewModel());
});
   
/*
    * For searching and pagination format from the datatable 
   */
function InitializeDataTable() {
    //Datatable 
    if ($.fn.dataTable.isDataTable('#DataTable')) {  //if false
        alert('Here');
        // $('#DataTable').DataTable().reload();   //.draw() function is used to load datatable 
    }
    else {
        $('#DataTable').DataTable({  // if true
            "responsive": true,
            "autoWidth": false,
            "searching": true,
            //to show in pagination format
            "paging": true,
            "lengthMenu": [[2, 5, 10, 25, 50, -1], [2, 5, 10, 25, 50, "All"]]
        });
    }
}