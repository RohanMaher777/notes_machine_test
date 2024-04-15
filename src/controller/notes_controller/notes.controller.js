const jwt = require("jsonwebtoken")
const db = require("../../../config/db.config")
const { where,Sequelize } = require("sequelize")
const User = db.user
const Notes = db.notes
const access_secret_key = process.env.ACCESS_SECRET_KEY



// create Notes 
exports.createNotes = async (req, res) => {
    const { title, body, } = req.body
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

        const time_of_creation = Date.now()

        const creatingNotes = await Notes.create({
            title: title,
            body: body,
            creation_time : time_of_creation,
            userId : find_user.id
        })

        return res.status(200).json({
            status: true,
            message: "Notes created successfully",
            data: creatingNotes
        })

    }
    catch (error) {
        console.error('Add_Notes_error:', error.message);
        return res.status(500).json({ 
            status : false,
            message: 'Internal Server error' 
        });
    }
}

//Get all notes 
exports.getAllNotes = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const pageSize = parseInt(req.query.pageSize) || 10
        const offset = (page - 1) * pageSize
        const AllNotes = await Notes.findAll(
            {
                offset: offset,
                limit: pageSize
            }
        )
        if(!AllNotes){
            return res.status(400).json({
                status : false,
                message : "Notes are not exists"
            })
        }

        return res.status(200).json({
            status: true,
            message: "Notes retrived successfully",
            data: AllNotes
        })

    }
    catch (error) {
        console.error('Get_All_Notes_error:', error.message);
        return res.status(500).json({ 
            status : false,
            message: 'Internal Server error' 
        });
    }
}

//Get notes by its id  
exports.get_notes_by_id = async (req, res) => {
    try {
        const id = req.params.note_id 
        if(!id){
            return res.status(400).json({
                status :false,
                message : "Please provide notes id"
            })
        }
        const getNote = await Notes.findByPk(id)
        if(!getNote){
            return res.status(400).json({
                status : false,
                message : "Note not exists"
            })
        }

        return res.status(200).json({
            status: true,
            message: "Notes retrived successfully",
            data: getNote
        })

    }
    catch (error) {
        console.error('Get_notes_by_id_error:', error.message);
        return res.status(500).json({ 
            status : false,
            message: 'Internal Server error' 
        });
    }
}


//Update notes by its id  
exports.update_notes_by_id = async (req, res) => {
    try {
        const id = req.params.note_id 
        const {title, body} = req.body
        if(!id){
            return res.status(400).json({
                status :false,
                message : "Please provide notes id"
            })
        }
        const getNote = await Notes.findByPk(id)
        if(!getNote){
            return res.status(400).json({
                status : false,
                message : "Note not found"
            })
        }
        const time_of_updation = Date.now()
        const updateNote = await Notes.update({
            title : title,
            body : body,
            updation_time : time_of_updation
        },
       { where : {id : id}})

        return res.status(200).json({
            status: true,
            message: "Note updated successfully",
            data: updateNote
        })

    }
    catch (error) {
        console.error('Update_Note_by_id_error:', error.message);
        return res.status(500).json({ 
            status : false,
            message: 'Internal Server error' 
        });
    }
}


// Delete notes by its id

exports.delete_user = async (req, res, next) => {
    try {
        const { note_id } = req.params
        if(!note_id){
            return res.status(400).json({
                status : false,
                message : "Please provide notes id"
            })
        }
        const find_note = await User.findByPk(note_id)
        if (!find_note) {
            return res.status(400).json({
                status: false,
                message: "note not exist"
            })
        }

        const delete_note = await Notes.destroy({
            where: {
                id: note_id
            }
        })
        return res.status(200).json({
            status: true,
            message: "Note deleted successfully"
        })
    }
    catch (error) {
        console.error('Delete_Note_by_id_error:', error.message);
        return res.status(500).json({ 
            status : false,
            message: 'Internal Server error' 
        });

    }
}


exports.get_note_by_search = async(req, res) =>{
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const {text} = req.params
        let query = {
            where: {},
          };
        
          if (text) {
            query.where.title = { [Sequelize.Op.like]: `%${text}%` };
          }

        const getNote = await Notes.findAll({
            where: query.where,
            include:[{
                model: User,
                as: "user"
            }
        ],
        order: [["id", "DESC"]],
        limit: limit,
        offset: offset,
        })
        const totalCount = await Notes.count({});
        const totalPages = Math.ceil(totalCount / limit);
 

        if(getNote){
            return res.status(200).json({
                status : true,
                message : " get Notes",
                data : getNote,
                currentPage: page,
                totalPages: totalPages,
            })
        }else{
            return res.status(400).json({
                status : false,
                message : "Notes not found"
            })
        }
    } catch (error) {
        console.log("search_error", error.message)
        return res.status(500).json({
            status : false,
            message : error.message
        })
    }
}
