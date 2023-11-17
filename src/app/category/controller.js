const { PrismaClient} = require("@prisma/client")
const {response} = require("express")

const prisma = new PrismaClient()


// GET METHOD
const getallCategory = async (req, res) => {
    try {
        const response = await prisma.category.findMany()
        res.status(200).json({ success: true, message: "All categories successfully retrieved", data: response })
    } catch (err) {
        res.status(500).json({ success: false, message: `Failed to retrieve categories: ${err.message}` })
    }
}


// GET METHOD (SPECIFIC BY ID)
const getCategorybyId = async (req, res) => {
    const categoryId = Number(req.params.id)
    try {
        const response = await prisma.category.findUnique({
            where:{
                id: categoryId
            }
        })

        if(!response) {
            return res.status(404).json({message: "Category id IS NOT FOUND"})
            
        }

        res.status(200).json({success: true, message:"Item by ID is retrieve sucessfully", data: response})

    } catch(err){

        res.status(404).json({success: false, message: `Failed to retrieve category: ${err.message}`})

    }
}

// POST METHOD 
const createCategory = async (req, res) => {
    const body = req.body
    try {
        const createdCategory = await prisma.category.create({
            data: {
                name: body.name,
                slug: body.slug,
                image: body.image
            }
        })
        res.status(201).json({ success: true, message: "Category has been created successfully", data: createdCategory })
    } catch (err) {
        res.status(500).json({ success: false, message: `Failed to create category: ${err.message}` })
    }
}

// PUT METHOD 
const updateCategory = async (req, res) => {
    const body = req.body
    try{
        const categoryId = Number(req.params.id)

        const updatedCategory = await prisma.category.update({
            where: {
                id: categoryId,
            },
            data: body,
            include: {
                items: true
            },
        })
        res.status(200).json({success: true, message: "Categories has been successfully updated", data: updatedCategory})

    } catch(err){
        res.status(400).json({success: false, message: `Failed to update categories: ${err.message}`})

    }
}

const deleteCategory = async (req, res) => {
    const body = req.body
    try{
        const categoryId = Number(req.params.id)
       const category = await prisma.category.findUnique({
        where: {
            id: categoryId,
        },
        include: {
            items: true
        },
    })

    if(!category) {
        return res.status(404).json({ success: false, message: "Category not found" })
        

    }

    const deletedCategory = await prisma.category.delete({
        where: {
            id: categoryId,
        },
    })

    res.status(200).json({success: true, message: "Category has been deleted", data: deletedCategory});


    } catch (err) {

        res.status(400).json({ success: false, message: `Failed to delete categories: ${err.message}` })

    }
}



module.exports = {getallCategory, getCategorybyId, createCategory, updateCategory, deleteCategory}