USE [EmployeeTaskMgt]
GO
/****** Object:  Table [dbo].[Employee]    Script Date: 5/15/2022 11:19:00 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Employee](
	[Emp_ID] [int] NOT NULL,
	[Employee_Name] [nvarchar](50) NULL,
	[Status] [varchar](50) NULL,
 CONSTRAINT [PK_Emplyee] PRIMARY KEY CLUSTERED 
(
	[Emp_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Task]    Script Date: 5/15/2022 11:19:00 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Task](
	[Task_Id] [int] NOT NULL,
	[Task_Title] [varchar](50) NULL,
	[Description] [text] NULL,
	[Task_Status] [varchar](50) NULL,
	[Emp_ID] [int] NULL,
 CONSTRAINT [PK__Task__716F4AEDADEBE245] PRIMARY KEY CLUSTERED 
(
	[Task_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
INSERT [dbo].[Employee] ([Emp_ID], [Employee_Name], [Status]) VALUES (1, N'Ram Kc', N'Active')
INSERT [dbo].[Employee] ([Emp_ID], [Employee_Name], [Status]) VALUES (2, N'Sita Thapa', N'Active')
INSERT [dbo].[Task] ([Task_Id], [Task_Title], [Description], [Task_Status], [Emp_ID]) VALUES (1, N'Test', N'sasasasa', N'New', 1)
ALTER TABLE [dbo].[Task]  WITH CHECK ADD  CONSTRAINT [FK__Task__Emp_ID__1273C1CD] FOREIGN KEY([Emp_ID])
REFERENCES [dbo].[Employee] ([Emp_ID])
GO
ALTER TABLE [dbo].[Task] CHECK CONSTRAINT [FK__Task__Emp_ID__1273C1CD]
GO
/****** Object:  StoredProcedure [dbo].[spDeleteTaskDetail]    Script Date: 5/15/2022 11:19:00 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create procedure [dbo].[spDeleteTaskDetail]
(
@Task_Id int
)
as 
begin
delete  from Task  where Task_ID=@Task_Id
end
GO
/****** Object:  StoredProcedure [dbo].[spGetEmployee]    Script Date: 5/15/2022 11:19:00 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

create procedure [dbo].[spGetEmployee]
as
begin 
select * from Employee
End 
GO
/****** Object:  StoredProcedure [dbo].[spGetTaskDetailList]    Script Date: 5/15/2022 11:19:00 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE procedure [dbo].[spGetTaskDetailList]
as
begin 
select T.*,E.Employee_Name from Task T
INNER JOIN  Employee E ON T.Emp_ID=E.Emp_ID 

end
GO
/****** Object:  StoredProcedure [dbo].[spGetTaskDetailListByID]    Script Date: 5/15/2022 11:19:00 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[spGetTaskDetailListByID]
@Task_id int
as
begin
select T.*,E.EMP_ID,E.Employee_Name from 
Task T INNER JOIN Employee E 
ON T.Emp_ID=E.Emp_ID
where Task_Id=@Task_id
end



GO
/****** Object:  StoredProcedure [dbo].[spSaveTaskDetail]    Script Date: 5/15/2022 11:19:00 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[spSaveTaskDetail]
@Task_Title varchar(50),
@Description text,
@Task_Status varchar(50),
@Emp_ID int
as 
begin
insert into Task(Task_Id,Task_Title,Description,Task_Status,Emp_ID)
values((select ISNULL(max(Task_Id),0)+1 from Task),@Task_Title,@Description,@Task_Status,@Emp_ID)
end
GO
/****** Object:  StoredProcedure [dbo].[spUpdateTaskDetail]    Script Date: 5/15/2022 11:19:00 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create procedure  [dbo].[spUpdateTaskDetail]
@Task_Title varchar(50),
@Description text,
@Task_Status varchar(50),
@Emp_ID int,
@Task_Id int 
as
begin
update Task set Task_Title=@Task_Title,Description=@Description,Task_Status=@Task_Status,Emp_ID=@Emp_ID
where Task_Id=@Task_Id
end


GO
