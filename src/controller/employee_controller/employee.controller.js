const jwt = require("jsonwebtoken")
const db = require("../../../config/db.config")
const User = db.user
const Employee = db.employee
const access_secret_key = process.env.ACCESS_SECRET_KEY



// create Notes 
exports.createEmployee = async (req, res) => {
    const { role_type} = req.body
    try {
        const auth_header = req.headers['authorization']

        if (!auth_header) {
            return res.status(401).json({ message: 'Authorization header missing' })
        }
        const token = auth_header.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Bearer token missing' });
        }
        const decode_Token = jwt.verify(token, access_secret_key)
        const find_user = await User.findByPk(decode_Token.id)
        if (!find_user) {
            return res.status(400).json({ error: "Invalid access token" })
        }
        const type = decode_Token.type

        const isEmptykey = Object.keys(req.body).some(key => {
            const value = req.body[key]
            return value === '' || value === null || value === undefined;
        })
        if (isEmptykey) {
            return res.status(400).json({ error: "please do not give empty fileds" })
        }


        const creatingEmployee = await Employee.create({
            role_type : role_type,
            userId : find_user.id
        })

        return res.status(200).json({
            status: true,
            message: "employee created successfully",
            data: creatingEmployee
        })

    }
    catch (error) {
        console.error('Add_employee_error:', error.message);
        return res.status(500).json({ 
            status : false,
            message: 'Internal Server error' 
        });
    }
}


//Get all notes 
exports.getAllEmployee = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const pageSize = parseInt(req.query.pageSize) || 10
        const offset = (page - 1) * pageSize
        const AllEmployee = await Employee.findAll(
            {
                include:[{
                    model: User,
                    as: "user",
                    attributes:['id','name']
                    },
                
                ],
                offset: offset,
                limit: pageSize
            }
        )
        if(!AllEmployee){
            return res.status(400).json({
                status : false,
                message : "Employees are not exists"
            })
        }

        return res.status(200).json({
            status: true,
            message: "Employee retrived successfully",
            data: AllEmployee
        })

    }
    catch (error) {
        console.error('Get_All_Employee_error:', error.message);
        return res.status(500).json({ 
            status : false,
            message: 'Internal Server error' 
        });
    }
}