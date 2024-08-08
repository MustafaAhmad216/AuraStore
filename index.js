var $hXvsm$process = require("process");
var $hXvsm$path = require("path");
var $hXvsm$express = require("express");
var $hXvsm$morgan = require("morgan");
var $hXvsm$dotenv = require("dotenv");
var $hXvsm$cors = require("cors");
var $hXvsm$compression = require("compression");
var $hXvsm$mongoose = require("mongoose");
var $hXvsm$sharp = require("sharp");
var $hXvsm$expressasynchandler = require("express-async-handler");
var $hXvsm$uuid = require("uuid");
var $hXvsm$slugify = require("slugify");
var $hXvsm$multer = require("multer");
var $hXvsm$crypto = require("crypto");
var $hXvsm$jsonwebtoken = require("jsonwebtoken");
var $hXvsm$bcryptjs = require("bcryptjs");
var $hXvsm$nodemailer = require("nodemailer");
var $hXvsm$expressvalidator = require("express-validator");
var $hXvsm$stripe = require("stripe");

/* eslint-disable import/no-extraneous-dependencies */ /* -----------------------------Imports----------------------------- */ var $2685e5b20c9f29f6$var$__dirname = "";







var $62946481e995a120$exports = {};


$hXvsm$dotenv.config({
    path: "config.env"
});
const $62946481e995a120$var$dbConnection = function() {
    //******************** Database connection logic here ********************
    //connect with DB
    const DB = undefined.replace("<PASSWORD>", undefined);
    $hXvsm$mongoose.connect(DB).then(()=>{
        console.log(`DB connection successfully established!\u{1F973}`);
    });
};
$62946481e995a120$exports = $62946481e995a120$var$dbConnection;


var $df4918d75e68c40b$exports = {};
/*Routes that supposed to be called in server.js*/ var $f532c635ed3b398d$exports = {};
/* eslint-disable import/no-extraneous-dependencies */ 
/* eslint-disable import/no-extraneous-dependencies */ /**********************************************************************************/ //upload Single Image
var $cb807965cf85cd49$export$c4163789566e6e13;
//--------------------------------------------------------
//--imageProcessing applied on the buffer image in memory
//--while if we stored the image directly to diskStorage then sharp middleware function is not needed
var $cb807965cf85cd49$export$d72d16f636eb072f;
/********************************************************************************/ // @desc		Get All Categories
// @route 	GET  /api/v1/categories
// @access	Public
var $cb807965cf85cd49$export$36bfd9279b3a24b7;
// @desc		Get a Single Category
// @route 	GET  /api/v1/categories/:id
// @access	Public
var $cb807965cf85cd49$export$410364bbb673ddbc;
// @desc		Create Category
// @route 	POST  /api/v1/categories
// @access	Private --> (Admin, Manager)
var $cb807965cf85cd49$export$7ce9dbcc6d544b1;
// @desc		Update Specific Category
// @route 	PATCH  /api/v1/categories/:id
// @access	Private --> (Admin, Manager)
var $cb807965cf85cd49$export$daaacb0271870c9;
// @desc		Delete Specific Category
// @route 	DELETE  /api/v1/categories/:id
// @access	Private --> (Admin, Manager)
var $cb807965cf85cd49$export$c0a90379dccf4f2f;



var $cb807965cf85cd49$require$uuidv4 = $hXvsm$uuid.v4;
/************************************************************************/ var $227fa3de72c027a5$export$2774c37398bee8b2;
// @desc		Get a Single document
// @access	Public
var $227fa3de72c027a5$export$2eb5ba9a66e42816;
// @desc		Create a document
// @access	Private
var $227fa3de72c027a5$export$5d49599920443c31;
// @desc		Update Specific document
// @access	Private
var $227fa3de72c027a5$export$3220ead45e537228;
// @desc		Delete Specific document
// @access	Private
var $227fa3de72c027a5$export$36a479340da3c347;

var $7c7a5bb37ebf3b57$exports = {};
//@desc 		This class is responsible for operational(predictable) errors
class $7c7a5bb37ebf3b57$var$AppError extends Error {
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "Fail" : "Error";
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
$7c7a5bb37ebf3b57$exports = $7c7a5bb37ebf3b57$var$AppError;


var $a240ac9f158cffd9$exports = {};
/* eslint-disable node/no-unsupported-features/es-syntax */ class $a240ac9f158cffd9$var$ApiFeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }
    filter() {
        //1) Filtering simple queries
        const queryObj = {
            ...this.queryString
        };
        const excludedFields = [
            "page",
            "limit",
            "fields",
            "skip",
            "sort",
            "keyword"
        ];
        excludedFields.forEach((field)=>delete queryObj[field]);
        //2) Filtering Advanced queries
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt|eq|ne|in|nin)\b/g, (match)=>`$${match}`);
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }
    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.replaceAll(",", " ");
            // const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else this.query = this.query.sort("-createdAt"); // default sort by createdAt in descending order if no sort parameter is provided.
        return this;
    }
    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.replaceAll(",", " ");
            // const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else this.query = this.query.select("-__v");
        return this;
    }
    search() {
        if (this.queryString.keyword) {
            const { keyword: keyword } = this.queryString;
            if (this.query.mongooseCollection.modelName === "Product") this.query = this.query.find({
                $or: [
                    {
                        title: {
                            $regex: keyword,
                            $options: "i"
                        }
                    },
                    {
                        description: {
                            $regex: keyword,
                            $options: "i"
                        }
                    }
                ]
            });
            else this.query = this.query.find({
                $or: [
                    {
                        name: {
                            $regex: keyword,
                            $options: "i"
                        }
                    },
                    {
                        slug: {
                            $regex: keyword,
                            $options: "i"
                        }
                    }
                ]
            });
        }
        return this;
    }
    paginate(documentsCount) {
        const page = +this.queryString.page || 1;
        const limit = +this.queryString.limit || 15;
        const skip = (page - 1) * limit;
        //Pagination Result
        const pagination = {};
        pagination.page = page;
        pagination.limit = limit;
        pagination.numOfPages = Math.ceil(documentsCount / limit);
        //Page 1 & there're other pages
        if (page === 1 && pagination.numOfPages > 1) pagination.nextPage = page + 1;
        if (page === pagination.numOfPages) pagination.prevPage = page - 1;
        if (page > 1 && page < pagination.numOfPages) {
            pagination.nextPage = page + 1;
            pagination.prevPage = page - 1;
        }
        this.query = this.query.skip(skip).limit(limit);
        this.paginationResult = pagination;
        return this;
    }
}
$a240ac9f158cffd9$exports = $a240ac9f158cffd9$var$ApiFeatures;


$227fa3de72c027a5$export$2774c37398bee8b2 = (Model)=>$hXvsm$expressasynchandler(async (req, res, next)=>{
        // Nested route handler
        let filterObj = {};
        if (Model.modelName === "SubCategory") {
            if (req.params.categoryId) filterObj = {
                category: req.params.categoryId
            };
        }
        if (Model.modelName === "Review") {
            if (req.params.productId) filterObj = {
                product: req.params.productId
            };
        }
        if (Model.modelName === "Order") // eslint-disable-next-line prefer-destructuring
        filterObj = req.filterObj;
        //(*) Filter, Search, Pagination, Sorting, limitingFields are in ApiFeatures class
        // Building query using ApiFeatures class and then Execute it
        const documentsCount = await Model.countDocuments();
        const features = new $a240ac9f158cffd9$exports(Model.find(filterObj), req.query).search().filter().sort().limitFields().paginate(documentsCount);
        const { paginationResult: paginationResult, query: query } = features;
        const document = await query;
        res.status(200).json({
            status: "success",
            numOfPages: paginationResult.numOfPages,
            page: paginationResult.page,
            results: document.length,
            data: {
                document: document
            }
        });
    });
$227fa3de72c027a5$export$2eb5ba9a66e42816 = (Model, populateOptions)=>$hXvsm$expressasynchandler(async (req, res, next)=>{
        let query = Model.findById(req.params.id);
        if (populateOptions) query = query.populate(populateOptions);
        const doc = await query;
        if (!doc) return next(new $7c7a5bb37ebf3b57$exports(`No ${Model.modelName} found with the id:${req.params.id}!\u{1F61E}`, 404));
        res.status(200).json({
            status: "success",
            data: {
                doc: doc
            }
        });
    });
$227fa3de72c027a5$export$5d49599920443c31 = (Model)=>$hXvsm$expressasynchandler(async (req, res, next)=>{
        const doc = await Model.create(req.body);
        res.status(201).json({
            status: "success",
            message: `${Model.modelName} created successfully! \u{1F917}`,
            data: doc
        });
    });
$227fa3de72c027a5$export$3220ead45e537228 = (Model)=>$hXvsm$expressasynchandler(async (req, res, next)=>{
        if (req.body.password || req.body.passwordConfirm) return next(new $7c7a5bb37ebf3b57$exports("Can not update password with this route! Try /updatePassword", 403));
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!doc) return next(new $7c7a5bb37ebf3b57$exports(`No ${Model.modelName} found with the id:${req.params.id}!\u{1F61E}`, 404));
        //Trigger "save" event when is updated
        doc.save();
        res.status(200).json({
            status: "success",
            message: `${Model.modelName} updated successfully!`,
            data: doc
        });
    });
$227fa3de72c027a5$export$36a479340da3c347 = (Model)=>$hXvsm$expressasynchandler(async (req, res, next)=>{
        const doc = await Model.findByIdAndDelete(req.params.id);
        // const doc = Model.findById(req.params.id);
        if (!doc) return next(new $7c7a5bb37ebf3b57$exports(`No ${Model.modelName} found with the id of ${req.params.id}`, 404));
        //Nothing worked in the Schema middleware so we're going to apply it here
        if (Model.modelName === "Review") await Model.calcAvgRatingsAndQuantity(doc.product);
        res.status(204).send();
    });


var $c3e51bd3f658e01b$exports = {};
/* eslint-disable prefer-arrow-callback */ 
const { Schema: $c3e51bd3f658e01b$var$Schema } = $hXvsm$mongoose;

//1- Create Schema
const $c3e51bd3f658e01b$var$categorySchema = new $c3e51bd3f658e01b$var$Schema({
    name: {
        type: String,
        required: [
            true,
            "Each Category must have a Name!"
        ],
        unique: [
            true,
            "Category Name must be unique!"
        ],
        minlength: [
            3,
            "Category Name must be more than 2 characters!"
        ],
        maxlength: [
            50,
            "Category Name must be less than 50 characters!"
        ],
        lowercase: true
    },
    slug: {
        type: String,
        lowercase: true
    },
    image: {
        type: String
    }
}, {
    timestamps: true,
    // toJSON: { virtuals: true },
    toObject: {
        virtuals: true
    }
});
//------------------------------------------------------------------------
//Virtual Populate
// categorySchema.virtual('subCategory', {
// 	ref: 'SubCategory',
// 	foreignField: 'category',
// 	localField: '_id',
// });
//------------------------------------------------------------------------
//DOCUMENT MIDDLEWARE: runs before or after .save() and .create() but not on .insertMany({})
$c3e51bd3f658e01b$var$categorySchema.pre("save", function(next) {
    if (!this.slug) this.slug = $hXvsm$slugify(this.name);
    next();
});
$c3e51bd3f658e01b$var$categorySchema.pre("findOneAndUpdate", function(next) {
    const update = this.getUpdate();
    if (update.name) update.slug = $hXvsm$slugify(update.name, {
        lower: true
    });
    next();
});
// categorySchema.pre(/^find/, function (next) {
// 	this.find().select('-createdAt -updatedAt');
// 	next();
// });
//------------------------------------------------------------------
//Set ImageUrl
const $c3e51bd3f658e01b$var$setImageUrl = function(doc) {
    if (doc.image) {
        const imageUrl = `${undefined}/img/categories/${doc.image}`;
        doc.image = imageUrl;
    }
};
// Adjust ImageURL After Retrieving or Updating a document
$c3e51bd3f658e01b$var$categorySchema.post("init", (doc)=>$c3e51bd3f658e01b$var$setImageUrl(doc));
// Adjust ImageURL After Creating a document
$c3e51bd3f658e01b$var$categorySchema.post("save", (doc)=>$c3e51bd3f658e01b$var$setImageUrl(doc));
//------------------------------------------------------------------------
//2- Create Model
$c3e51bd3f658e01b$exports = $hXvsm$mongoose.model("Category", $c3e51bd3f658e01b$var$categorySchema);


/* eslint-disable import/no-extraneous-dependencies */ var $2c9b9452479b6f6f$export$88dda684c83f14b5;
var $2c9b9452479b6f6f$export$a935ca3be26049b2;


/************************************************************************/ // Multer setup
const $2c9b9452479b6f6f$var$multerOptions = ()=>{
    // 1- Memory Storage Engine
    //--Store the image as a buffer in memory to be saved later in diskstorage
    //--(storing image after imageProcessing)
    const multerStorage = $hXvsm$multer.memoryStorage();
    // 2- File Filter
    const multerFilter = (req, file, cb)=>{
        if (file.mimetype.split("/")[0] === "image") cb(null, true);
        else cb(new $7c7a5bb37ebf3b57$exports("Please Upload a valid image!", 400), false);
    };
    // 3- upload the image
    const upload = $hXvsm$multer({
        storage: multerStorage,
        fileFilter: multerFilter
    });
    return upload;
};
$2c9b9452479b6f6f$export$88dda684c83f14b5 = (fieldName)=>$2c9b9452479b6f6f$var$multerOptions().single(fieldName);
$2c9b9452479b6f6f$export$a935ca3be26049b2 = (arrayOfFields)=>$2c9b9452479b6f6f$var$multerOptions().fields(arrayOfFields);


var $cb807965cf85cd49$require$uploadSingleImage = $2c9b9452479b6f6f$export$88dda684c83f14b5;
$cb807965cf85cd49$export$c4163789566e6e13 = $cb807965cf85cd49$require$uploadSingleImage("image");
$cb807965cf85cd49$export$d72d16f636eb072f = $hXvsm$expressasynchandler(async (req, res, next)=>{
    if (!req.file) return next();
    req.file.filename = `category-${$cb807965cf85cd49$require$uuidv4()}-${Date.now()}.jpeg`;
    await $hXvsm$sharp(req.file.buffer).resize(600, 500).toFormat("jpeg").jpeg({
        quality: 93
    }).toFile(`public/img/categories/${req.file.filename}`);
    // Save Image to DB
    req.body.image = req.file.filename;
    next();
});
$cb807965cf85cd49$export$36bfd9279b3a24b7 = $227fa3de72c027a5$export$2774c37398bee8b2($c3e51bd3f658e01b$exports);
$cb807965cf85cd49$export$410364bbb673ddbc = $227fa3de72c027a5$export$2eb5ba9a66e42816($c3e51bd3f658e01b$exports);
$cb807965cf85cd49$export$7ce9dbcc6d544b1 = $227fa3de72c027a5$export$5d49599920443c31($c3e51bd3f658e01b$exports);
$cb807965cf85cd49$export$daaacb0271870c9 = $227fa3de72c027a5$export$3220ead45e537228($c3e51bd3f658e01b$exports);
$cb807965cf85cd49$export$c0a90379dccf4f2f = $227fa3de72c027a5$export$36a479340da3c347($c3e51bd3f658e01b$exports);


/* eslint-disable import/no-extraneous-dependencies */ // const { promisify } = require('util');
/************************************************************************/ //@desc		sign up
//@route 	POST /api/v1/auth/signup
//@access 	Public
var $ce487c6e3030a219$export$7200a869094fec36;
//@desc		login
//@route 	POST /api/v1/auth/login
//@access 	Public
var $ce487c6e3030a219$export$596d806903d1f59e;
//@desc		Make sure user is authenticated
var $ce487c6e3030a219$export$eda7ca9e36571553;
//@desc		[Authorization --> User Permissions]
//@desc		restrict some requests to admins or managers only
var $ce487c6e3030a219$export$e1bac762c84d3b0c;
//@desc		forgot Password
//@route 	POST /api/v1/auth/forgetPassword
//@access 	Public
var $ce487c6e3030a219$export$66791fb2cfeec3e;
//@desc		verify Reset Password Code
//@route 	PATCH /api/v1/auth/verifyResetCode
//@access 	Public
var $ce487c6e3030a219$export$5015bc4d379e799b;
//@desc		Reset Password
//@route 	PATCH /api/v1/auth/resetPassword
//@access 	Public
var $ce487c6e3030a219$export$dc726c8e334dd814;



var $ca4b57b91abcd647$exports = {};
/* eslint-disable import/no-extraneous-dependencies */ 


const { Schema: $ca4b57b91abcd647$var$Schema } = $hXvsm$mongoose;
/***********************************************************************/ //1- Create Schema
const $ca4b57b91abcd647$var$userSchema = new $ca4b57b91abcd647$var$Schema({
    name: {
        type: String,
        required: [
            true,
            "Each User must have a Name!"
        ],
        minlength: [
            3,
            "Name must be more than 2 characters!"
        ],
        maxlength: [
            52,
            "Name must be less than 52 characters!"
        ],
        trim: true
    },
    slug: {
        type: String,
        lowercase: true
    },
    email: {
        type: String,
        required: [
            true,
            "Each User must have an Email!"
        ],
        unique: [
            true,
            "Email must be unique!"
        ]
    },
    phone: {
        type: String
    },
    profilePicture: {
        type: String,
        default: "default.jpg"
    },
    role: {
        type: String,
        enum: [
            "user",
            "admin",
            "manager"
        ],
        default: "user"
    },
    //Embedded Document
    address: [
        {
            id: {
                type: $ca4b57b91abcd647$var$Schema.ObjectId
            },
            alias: {
                type: String,
                required: [
                    true,
                    "Address must have an alias!"
                ],
                minlength: [
                    3,
                    "Alias must be more than 2 characters!"
                ],
                maxlength: [
                    20,
                    "Alias must be less than 20 characters!"
                ],
                trim: true,
                lowercase: true
            },
            details: {
                type: String,
                required: [
                    true,
                    "Address must be detailed!"
                ],
                minlength: [
                    10,
                    "Address must be more than 10 characters!"
                ],
                maxlength: [
                    90,
                    "Address must be less than 90 characters!"
                ],
                trim: true,
                lowercase: true
            },
            postalCode: Number,
            phone: String,
            city: {
                type: String,
                lowercase: true
            }
        }
    ],
    password: {
        type: String,
        required: [
            true,
            "Please provide a valid password!"
        ],
        minlength: [
            8,
            "A password must be at least 8 characters!"
        ],
        maxlength: [
            70,
            "A password shouldn't be more than 70 characters!"
        ]
    },
    passwordConfirm: {
        type: String,
        required: [
            true,
            "Please confirm your password!"
        ]
    },
    passwordChangedAt: {
        type: Date
    },
    passwordResetToken: {
        type: String
    },
    passwordResetExpires: {
        type: Date
    },
    passwordResetVerified: {
        type: Boolean
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    //child reference (one to many)
    wishlist: [
        {
            type: $ca4b57b91abcd647$var$Schema.ObjectId,
            ref: "Product"
        }
    ]
}, {
    timestamps: true
});
//------------------------------------------------------------------------
//DOCUMENT MIDDLEWARE: runs before or after .save() and .create() but not on .insertMany({})
$ca4b57b91abcd647$var$userSchema.pre("save", function(next) {
    if (!this.slug) this.slug = $hXvsm$slugify(this.name);
    next();
});
$ca4b57b91abcd647$var$userSchema.pre(/^find/, function(next) {
    this.find({
        active: {
            $ne: false
        }
    });
    next();
});
$ca4b57b91abcd647$var$userSchema.pre("findOneAndUpdate", function(next) {
    const update = this.getUpdate();
    if (update.name) update.slug = $hXvsm$slugify(update.name, {
        lower: true
    });
    next();
});
$ca4b57b91abcd647$var$userSchema.pre("save", async function(next) {
    // Hash the password if it has been modified (or is new)
    if (!this.isModified("password")) return next();
    //Hash the password with cost of 12
    this.password = await $hXvsm$bcryptjs.hash(this.password, 12);
    //Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});
$ca4b57b91abcd647$var$userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await $hXvsm$bcryptjs.compare(candidatePassword, userPassword);
};
$ca4b57b91abcd647$var$userSchema.methods.passwordChangedAfter = function(decodedIat) {
    if (this.passwordChangedAt) {
        const changedTimeStamp = +this.passwordChangedAt.getTime() / 1000;
        return decodedIat < changedTimeStamp;
    }
    return false;
};
//------------------------------------------------------------------
//Set ImageUrl
const $ca4b57b91abcd647$var$setImageUrl = function(doc) {
    if (doc.profilePicture) doc.profilePicture = `${undefined}/img/users/${doc.profilePicture}`;
};
// Adjust ImageURL After Retrieving or Updating a document
$ca4b57b91abcd647$var$userSchema.post("init", (doc)=>$ca4b57b91abcd647$var$setImageUrl(doc));
// Adjust ImageURL After Creating a document
$ca4b57b91abcd647$var$userSchema.post("save", (doc)=>$ca4b57b91abcd647$var$setImageUrl(doc));
//------------------------------------------------------------------------
//2- Create Model
$ca4b57b91abcd647$exports = $hXvsm$mongoose.model("User", $ca4b57b91abcd647$var$userSchema);



/* eslint-disable import/no-extraneous-dependencies */ var $545272ecbbd69003$export$1cea2e25b75a88f2;

$545272ecbbd69003$export$1cea2e25b75a88f2 = async (options)=>{
    // 1) Create Transporter (service that will send email (ex. Gmail, mailtrap, sendGrid))
    const transporter = $hXvsm$nodemailer.createTransport({
        host: undefined,
        port: undefined,
        // secure: true,
        auth: {
            user: undefined,
            pass: undefined
        }
    });
    // 2) Define Email Options (ex. From, To, Subject and Content)
    const mailOptions = {
        from: undefined,
        to: options.email,
        subject: options.subject,
        text: options.message
    };
    // 3) SendEmail
    await transporter.sendMail(mailOptions);
}; // module.exports = sendEmail;


var $ce487c6e3030a219$require$sendEmail = $545272ecbbd69003$export$1cea2e25b75a88f2;
var $a5495d4c5996b41b$exports = {};

const $a5495d4c5996b41b$var$createToken = (id)=>$hXvsm$jsonwebtoken.sign({
        userId: id
    }, undefined, {
        expiresIn: undefined
    });
$a5495d4c5996b41b$exports = $a5495d4c5996b41b$var$createToken;


$ce487c6e3030a219$export$7200a869094fec36 = $hXvsm$expressasynchandler(async (req, res, next)=>{
    // 1- create a new user
    const user = await $ca4b57b91abcd647$exports.create({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });
    // 2- generate JWT token
    const token = $a5495d4c5996b41b$exports(user._id);
    // 3- send response
    res.status(201).json({
        status: "success",
        message: "User created successfully! ",
        token: token,
        data: {
            user: user
        }
    });
});
$ce487c6e3030a219$export$596d806903d1f59e = $hXvsm$expressasynchandler(async (req, res, next)=>{
    const { email: email, password: password } = req.body;
    // 1- check if user provided email and password (in loginValidator)
    // 2) check if user exists & if password is correct
    const user = await $ca4b57b91abcd647$exports.findOne({
        email: email
    }).select("+password").select("+active");
    if (!user || !user.correctPassword(password, user.password)) // if (!user || !(await bcrypt.compare(password, user.password)))
    return next(new $7c7a5bb37ebf3b57$exports("Please, check if your Email and Password are correct", 401));
    // 3) make user active
    // user.active = true;
    // 4) generate JWT token
    const token = $a5495d4c5996b41b$exports(user._id);
    // 5) send response
    res.json({
        status: "success",
        message: "User logged in successfully! ",
        token: token,
        data: {
            user: user
        }
    });
});
$ce487c6e3030a219$export$eda7ca9e36571553 = $hXvsm$expressasynchandler(async (req, res, next)=>{
    let token;
    // 1) Check if token exists, and catch it if exists
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) token = req.headers.authorization.split(" ")[1];
    if (!token) return next(new $7c7a5bb37ebf3b57$exports("You are not logged in! Please log in.", 401));
    // 2) Verify token (No Changes Happened, Token Not Expired)
    // const decoded = await promisify(jwt.verify)(
    // 	token,
    // 	process.env.JWT_SECRET_KEY,
    // );
    const decoded = $hXvsm$jsonwebtoken.verify(token, undefined);
    // 3) Check if user exists
    const currentUser = await $ca4b57b91abcd647$exports.findById(decoded.userId);
    if (!currentUser) return next(new $7c7a5bb37ebf3b57$exports("Unauthorized login! the user with this ID doesn't exist", 401));
    // 4) Check if user hasn't changed his password after the token was created
    if (currentUser.passwordChangedAt) {
        if (currentUser.passwordChangedAfter(decoded.iat)) return next(new $7c7a5bb37ebf3b57$exports("You've recently changed his password! Please login again.", 401));
    }
    // 5) If everything is fine, grant access to protected route
    req.user = currentUser;
    next();
});
$ce487c6e3030a219$export$e1bac762c84d3b0c = (...roles)=>$hXvsm$expressasynchandler(async (req, res, next)=>{
        // 1) access allowed roles
        // 2) access registered users (req.user.role)
        if (!roles.includes(req.user.role)) return next(new $7c7a5bb37ebf3b57$exports("You don't have permission to perform this action!", 403));
        next();
    });
$ce487c6e3030a219$export$66791fb2cfeec3e = $hXvsm$expressasynchandler(async (req, res, next)=>{
    // 1) Get User by Email Address
    const user = await $ca4b57b91abcd647$exports.findOne({
        email: req.body.email
    });
    if (!user) return next(new $7c7a5bb37ebf3b57$exports(`No User found with the email: ${req.body.email}`), 404);
    // 2) If user Exists, Generate encrypted reset random 6 digits code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetCode = $hXvsm$crypto.createHash("sha256").update(resetCode).digest("hex");
    // 3) Save Hashed Reset Code into DB
    user.passwordResetToken = hashedResetCode;
    user.passwordResetExpires = Date.now() + 600000; // 10 minutes
    user.passwordResetVerified = false;
    await user.save({
        validateBeforeSave: false
    });
    // 4) Send the reset code via Email Address
    const message = `Hi ${user.name.split(" ")[0]},\n\nWe received a request to reset your password on Ecommerce Api Website.\n\nHere's Your Reset Code:  { ${resetCode} } \u{1F60A}
You should know it's valid untill ${user.passwordResetExpires}\n\nThanks for helping us keep your data secure!`;
    try {
        await $ce487c6e3030a219$require$sendEmail({
            email: user.email,
            subject: `Password Reset Token`,
            message: message
        });
    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        user.passwordResetVerified = undefined;
        await user.save({
            validateBeforeSave: false
        });
        return next(new $7c7a5bb37ebf3b57$exports("there's an error in sending reset token via email", 500));
    }
    res.status(200).json({
        status: "success",
        message: `Your password Reset Code is sent via Email: <${user.email}>`
    });
    next();
});
$ce487c6e3030a219$export$5015bc4d379e799b = $hXvsm$expressasynchandler(async (req, res, next)=>{
    // 1) Get Reset Code from the body and hash it to match the one in DB
    const hashedResetCode = $hXvsm$crypto.createHash("sha256").update(req.body.resetCode).digest("hex");
    // 2) Get User by its resetPasswordCode
    const user = await $ca4b57b91abcd647$exports.findOne({
        passwordResetToken: hashedResetCode,
        passwordResetExpires: {
            $gt: Date.now()
        }
    });
    if (!user) return next(new $7c7a5bb37ebf3b57$exports(`The Code you've entered {${req.body.resetCode}} is invalid or has expired`, 400));
    // 3) Validate User's reset code
    user.passwordResetVerified = true;
    await user.save({
        validateBeforeSave: false
    });
    res.status(200).json({
        status: "success",
        message: "Code is verified successfully, please visit /api/v1/auth/resetPassword to reset your password"
    });
});
$ce487c6e3030a219$export$dc726c8e334dd814 = $hXvsm$expressasynchandler(async (req, res, next)=>{
    // 1) Get User by Email Address
    const user = await $ca4b57b91abcd647$exports.findOne({
        email: req.body.email
    });
    if (!user) return next(new $7c7a5bb37ebf3b57$exports(`No User found with the email: ${req.body.email}`, 404));
    // 2) Check if passwordResetVerified = true
    if (!user.passwordResetVerified) return next(new $7c7a5bb37ebf3b57$exports("Reset code is not verified or expired", 400));
    // 3) update user password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    user.passwordChangedAt = Date.now();
    await user.save();
    // 4) Everything's fine ? log the user in, send JWT
    const token = $a5495d4c5996b41b$exports(user._id);
    // 5) Send success message and token to the user
    res.status(200).json({
        status: "success",
        message: "Password has been reset successfully!",
        token: token,
        data: {
            user: user
        }
    });
});


var $ff25cd65427ee667$export$f2e7ee10fe81e2ce;
var $ff25cd65427ee667$export$c4215807052fa076;
var $ff25cd65427ee667$export$fb37b853886c7ffe;
var $ff25cd65427ee667$export$e3591f7f444861b7;

var $ff25cd65427ee667$require$check = $hXvsm$expressvalidator.check;
// //---------------------------- HELPER FUNCTIONS ----------------------------
var $76b9bbcfebdd77b8$export$28b9a274a2d1f575;
//-----------------------------------------------------------------------
var $76b9bbcfebdd77b8$export$fe6394b7002cf45e;


var $76b9bbcfebdd77b8$require$validationResult = $hXvsm$expressvalidator.validationResult;
$76b9bbcfebdd77b8$export$28b9a274a2d1f575 = (req, res, next)=>{
    if (!$hXvsm$mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({
        status: "Error",
        message: `Invalid Object ID format: ${req.params.id}`
    });
    next(); // Continue to the next middleware or route handler
};
$76b9bbcfebdd77b8$export$fe6394b7002cf45e = (req, res, next)=>{
    const errors = $76b9bbcfebdd77b8$require$validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({
        errors: errors.array()
    });
    next();
};


$ff25cd65427ee667$export$f2e7ee10fe81e2ce = [
    $ff25cd65427ee667$require$check("id").isMongoId().withMessage(`Invalid Object ID format!`),
    $76b9bbcfebdd77b8$export$fe6394b7002cf45e
];
$ff25cd65427ee667$export$c4215807052fa076 = [
    $ff25cd65427ee667$require$check("name").notEmpty().withMessage("Each Category must have a Name!").isLength({
        min: 3,
        max: 50
    }).withMessage("Each Category Name must be between 3 and 50 characters"),
    $76b9bbcfebdd77b8$export$fe6394b7002cf45e
];
$ff25cd65427ee667$export$fb37b853886c7ffe = [
    $ff25cd65427ee667$require$check("id").isMongoId().withMessage(`Invalid Object ID format!`),
    $ff25cd65427ee667$require$check("name").optional().isLength({
        min: 3,
        max: 50
    }).withMessage("Each Category Name must be between 3 and 50 characters"),
    $76b9bbcfebdd77b8$export$fe6394b7002cf45e
];
$ff25cd65427ee667$export$e3591f7f444861b7 = [
    $ff25cd65427ee667$require$check("id").isMongoId().withMessage(`Invalid Object ID format!`),
    $76b9bbcfebdd77b8$export$fe6394b7002cf45e
];


var $68dee80ddacd12e4$exports = {};

/**********************************************************************************/ var $c25979f8c04e3dfa$export$bbeda01cee8e2bf0;
// @desc		Get All Sub-Categories
// @route 	GET  /api/v1/subCategories
// @access	Public
var $c25979f8c04e3dfa$export$c85690e10ecd0338;
// @desc		Get a Single Sub-Category
// @route 	GET  /api/v1/subCategories/:id
// @access	Public
var $c25979f8c04e3dfa$export$1661b9de4cb63d0;
// @desc		Create Sub-Category
// @route 	POST  /api/v1/subCategories/:id
// @access	Private --> (Admin, Manager)
var $c25979f8c04e3dfa$export$26fa6f8facd30156;
//@desc		Update Sub-Category
//@route		PATCH /api/v1/subCategories/:id
//@access	Private --> (Admin, Manager)
var $c25979f8c04e3dfa$export$f55a30d0864db1f2;
// @desc		Delete Specific Sub-Category
// @route 	DELETE  /api/v1/subCategories/:id
// @access	Private --> (Admin, Manager)
var $c25979f8c04e3dfa$export$1cef25646f278d5d;

var $8385e6a8ab18bfe2$exports = {};

const { Schema: $8385e6a8ab18bfe2$var$Schema } = $hXvsm$mongoose;

const $8385e6a8ab18bfe2$var$subCategorySchema = new $8385e6a8ab18bfe2$var$Schema({
    name: {
        type: String,
        required: [
            true,
            "Each Sub-Category must have a Name!"
        ],
        unique: [
            true,
            "Sub-Category Name must be unique!"
        ],
        trim: true,
        minlength: [
            2,
            "Sub-Category Name must be more than 2 characters!"
        ],
        maxlength: [
            50,
            "Sub-Category Name must be less than 50 characters!"
        ],
        lowercase: true
    },
    slug: {
        type: String,
        lowercase: true
    },
    category: {
        type: $8385e6a8ab18bfe2$var$Schema.ObjectId,
        ref: "Category",
        required: [
            true,
            "Each Sub-Category must belong to a main Category"
        ]
    }
}, {
    timestamps: true,
    // toJSON: { virtuals: true },
    toObject: {
        virtuals: true
    }
});
$8385e6a8ab18bfe2$var$subCategorySchema.pre("save", function(next) {
    if (!this.slug) this.slug = $hXvsm$slugify(this.name);
    next();
});
$8385e6a8ab18bfe2$var$subCategorySchema.pre("findOneAndUpdate", function(next) {
    const update = this.getUpdate();
    if (update.name) update.slug = $hXvsm$slugify(update.name, {
        lower: true
    });
    next();
});
//------------------------------------------------------------------------
$8385e6a8ab18bfe2$var$subCategorySchema.pre(/^find/, function(next) {
    this.populate([
        {
            path: "category",
            select: "name"
        }
    ]);
    this.find().select("-createdAt -updatedAt");
    next();
});
//------------------------------------------------------------------------
//2- Create Model
$8385e6a8ab18bfe2$exports = $hXvsm$mongoose.model("SubCategory", $8385e6a8ab18bfe2$var$subCategorySchema);


$c25979f8c04e3dfa$export$bbeda01cee8e2bf0 = (req, res, next)=>{
    //Nested Route
    req.body.category = req.body.category || req.params.categoryId;
    next();
};
$c25979f8c04e3dfa$export$c85690e10ecd0338 = $227fa3de72c027a5$export$2774c37398bee8b2($8385e6a8ab18bfe2$exports);
$c25979f8c04e3dfa$export$1661b9de4cb63d0 = $227fa3de72c027a5$export$2eb5ba9a66e42816($8385e6a8ab18bfe2$exports);
$c25979f8c04e3dfa$export$26fa6f8facd30156 = $227fa3de72c027a5$export$5d49599920443c31($8385e6a8ab18bfe2$exports);
$c25979f8c04e3dfa$export$f55a30d0864db1f2 = $227fa3de72c027a5$export$3220ead45e537228($8385e6a8ab18bfe2$exports);
$c25979f8c04e3dfa$export$1cef25646f278d5d = $227fa3de72c027a5$export$36a479340da3c347($8385e6a8ab18bfe2$exports);



// Define a middleware function to validate user input
var $5c87d54188972ce5$export$45a5759f3e638f72;
var $5c87d54188972ce5$export$60c85a1ed39f0af3;
var $5c87d54188972ce5$export$f992ec9099527a;
var $5c87d54188972ce5$export$577d5635bda5e24c;

var $5c87d54188972ce5$require$check = $hXvsm$expressvalidator.check;



$5c87d54188972ce5$export$45a5759f3e638f72 = [
    $5c87d54188972ce5$require$check("id").isMongoId().withMessage(`Invalid Object ID format!`),
    $76b9bbcfebdd77b8$export$fe6394b7002cf45e
];
$5c87d54188972ce5$export$60c85a1ed39f0af3 = [
    $5c87d54188972ce5$require$check("name").notEmpty().withMessage("Each Sub-Category must have a Name!").isLength({
        min: 2,
        max: 50
    }).withMessage("Each Sub-Category Name must be between 3 and 50 characters"),
    $5c87d54188972ce5$require$check("category").notEmpty().withMessage("Each Sub-Category must belong to a Category!").isMongoId().withMessage("Invalid Object ID format!").custom(async (categoryId, { req: req })=>{
        //Check if categoryId already exists
        const categoryExist = await $c3e51bd3f658e01b$exports.findById(categoryId);
        if (!categoryExist) throw new $7c7a5bb37ebf3b57$exports(`No Category found with the id: ${categoryId} \u{1F615}`, 404);
        return true;
    }),
    $76b9bbcfebdd77b8$export$fe6394b7002cf45e
];
$5c87d54188972ce5$export$f992ec9099527a = [
    $5c87d54188972ce5$require$check("id").isMongoId().withMessage(`Invalid Object ID format!`),
    $76b9bbcfebdd77b8$export$fe6394b7002cf45e
];
$5c87d54188972ce5$export$577d5635bda5e24c = [
    $5c87d54188972ce5$require$check("id").isMongoId().withMessage(`Invalid Object ID format!`),
    $76b9bbcfebdd77b8$export$fe6394b7002cf45e
];


/*******************************************************************************/ //mergeParams Allow us to access parameeters from other Routers
const $68dee80ddacd12e4$var$router = $hXvsm$express.Router({
    mergeParams: true
});
//                     <<<< Nested Routes >>>>
//GET      /api/v1/categories/:categoryId/subCategories (To get child based on a parent)
//POST     /api/v1/categories/:categoryId/subCategories
$68dee80ddacd12e4$var$router.route("/").get($c25979f8c04e3dfa$export$c85690e10ecd0338).post($ce487c6e3030a219$export$eda7ca9e36571553, $ce487c6e3030a219$export$e1bac762c84d3b0c("admin", "manager"), $c25979f8c04e3dfa$export$bbeda01cee8e2bf0, $5c87d54188972ce5$export$60c85a1ed39f0af3, $c25979f8c04e3dfa$export$26fa6f8facd30156);
$68dee80ddacd12e4$var$router.route("/:id").get($5c87d54188972ce5$export$45a5759f3e638f72, $c25979f8c04e3dfa$export$1661b9de4cb63d0).patch($ce487c6e3030a219$export$eda7ca9e36571553, $ce487c6e3030a219$export$e1bac762c84d3b0c("admin", "manager"), $5c87d54188972ce5$export$f992ec9099527a, $c25979f8c04e3dfa$export$f55a30d0864db1f2).delete($ce487c6e3030a219$export$eda7ca9e36571553, $ce487c6e3030a219$export$e1bac762c84d3b0c("admin"), $5c87d54188972ce5$export$577d5635bda5e24c, $c25979f8c04e3dfa$export$1cef25646f278d5d);
$68dee80ddacd12e4$exports = $68dee80ddacd12e4$var$router;


// const validatorMiddleware = require('../middlewares/validatorMiddleware');
/*************************************************************************/ const $f532c635ed3b398d$var$router = $hXvsm$express.Router();
//                     <<<< Nested Routes >>>>
//GET      /api/v1/categories/:categoryId/subCategories (To get child based on a parent)
//POST     /api/v1/categories/:categoryId/subCategories
$f532c635ed3b398d$var$router.use("/:categoryId/subCategories", $68dee80ddacd12e4$exports);
$f532c635ed3b398d$var$router.route("/").get($cb807965cf85cd49$export$36bfd9279b3a24b7).post($ce487c6e3030a219$export$eda7ca9e36571553, $ce487c6e3030a219$export$e1bac762c84d3b0c("admin", "manager"), $cb807965cf85cd49$export$c4163789566e6e13, $cb807965cf85cd49$export$d72d16f636eb072f, $ff25cd65427ee667$export$c4215807052fa076, $cb807965cf85cd49$export$7ce9dbcc6d544b1);
$f532c635ed3b398d$var$router.route("/:id").get($ff25cd65427ee667$export$f2e7ee10fe81e2ce, $cb807965cf85cd49$export$410364bbb673ddbc).patch($ce487c6e3030a219$export$eda7ca9e36571553, $ce487c6e3030a219$export$e1bac762c84d3b0c("admin", "manager"), $cb807965cf85cd49$export$c4163789566e6e13, $cb807965cf85cd49$export$d72d16f636eb072f, $ff25cd65427ee667$export$fb37b853886c7ffe, $cb807965cf85cd49$export$daaacb0271870c9).delete($ce487c6e3030a219$export$eda7ca9e36571553, $ce487c6e3030a219$export$e1bac762c84d3b0c("admin"), $ff25cd65427ee667$export$e3591f7f444861b7, $cb807965cf85cd49$export$c0a90379dccf4f2f);
$f532c635ed3b398d$exports = $f532c635ed3b398d$var$router;



var $ddfe60ef2f51e535$exports = {};

/* eslint-disable import/no-extraneous-dependencies */ /**********************************************************************************/ //upload Single Image
var $96ee371c9b4a18ca$export$b47bd20998c03c20;
//--------------------------------------------------------
//--imageProcessing applied on the buffer image in memory
//--while if we stored the image directly to diskStorage then sharp middleware function is not needed
var $96ee371c9b4a18ca$export$e41bb0ffefb64a19;
/**********************************************************************************/ // @desc		Get All brands
// @route 	GET  /api/v1/brands
// @access	Public
var $96ee371c9b4a18ca$export$2a69f7703e082544;
// @desc		Get a Single Brand
// @route 	GET  /api/v1/brands/:id
// @access	Public
var $96ee371c9b4a18ca$export$1d2c84409087ed59;
// @desc		Create Brand
// @route 	POST  /api/v1/brands/:id
// @access	Private --> (Admin, Manager)
var $96ee371c9b4a18ca$export$64bd7b2eff30d454;
// @desc		Update Specific Brand
// @route 	PATCH  /api/v1/brands/:id
// @access	Private --> (Admin, Manager)
var $96ee371c9b4a18ca$export$47a68fa1f6473d7d;
// @desc		Delete Specific Brand
// @route 	DELETE  /api/v1/brands/:id
// @access	Private --> (Admin, Manager)
var $96ee371c9b4a18ca$export$b4ab2ccd2baf1bca;



var $96ee371c9b4a18ca$require$uuidv4 = $hXvsm$uuid.v4;


var $96ee371c9b4a18ca$require$uploadSingleImage = $2c9b9452479b6f6f$export$88dda684c83f14b5;
var $4107b4ee85fe1447$exports = {};

const { Schema: $4107b4ee85fe1447$var$Schema } = $hXvsm$mongoose;

//1- Create Schema
const $4107b4ee85fe1447$var$brandSchema = new $4107b4ee85fe1447$var$Schema({
    name: {
        type: String,
        required: [
            true,
            "Each Brand must have a Name!"
        ],
        unique: [
            true,
            "Brand Name must be unique!"
        ],
        minlength: [
            3,
            "Brand Name must be more than 2 characters!"
        ],
        maxlength: [
            30,
            "Brand Name must be less than 50 characters!"
        ],
        lowercase: true
    },
    slug: {
        type: String,
        lowercase: true
    },
    image: {
        type: String
    }
}, {
    timestamps: true,
    // toJSON: { virtuals: true },
    toObject: {
        virtuals: true
    }
});
//------------------------------------------------------------------------
//DOCUMENT MIDDLEWARE: runs before or after .save() and .create() but not on .insertMany({})
$4107b4ee85fe1447$var$brandSchema.pre("save", function(next) {
    if (!this.slug) this.slug = $hXvsm$slugify(this.name);
    next();
});
$4107b4ee85fe1447$var$brandSchema.pre("findOneAndUpdate", function(next) {
    const update = this.getUpdate();
    if (update.name) update.slug = $hXvsm$slugify(update.name, {
        lower: true
    });
    next();
});
// brandSchema.pre(/^find/, function (next) {
// 	this.find().select('-createdAt -updatedAt');
// 	next();
// });
//------------------------------------------------------------------
//Set ImageUrl
const $4107b4ee85fe1447$var$setImageUrl = function(doc) {
    if (doc.image) {
        const imageUrl = `${undefined}/img/brands/${doc.image}`;
        doc.image = imageUrl;
    }
};
// Adjust ImageURL After Retrieving or Updating a document
$4107b4ee85fe1447$var$brandSchema.post("init", (doc)=>$4107b4ee85fe1447$var$setImageUrl(doc));
// Adjust ImageURL After Creating a document
$4107b4ee85fe1447$var$brandSchema.post("save", (doc)=>$4107b4ee85fe1447$var$setImageUrl(doc));
//------------------------------------------------------------------------
//2- Create Model
$4107b4ee85fe1447$exports = $hXvsm$mongoose.model("Brand", $4107b4ee85fe1447$var$brandSchema);


$96ee371c9b4a18ca$export$b47bd20998c03c20 = $96ee371c9b4a18ca$require$uploadSingleImage("image");
$96ee371c9b4a18ca$export$e41bb0ffefb64a19 = $hXvsm$expressasynchandler(async (req, res, next)=>{
    if (!req.file) return next();
    req.file.filename = `brand-${$96ee371c9b4a18ca$require$uuidv4()}-${Date.now()}.jpeg`;
    await $hXvsm$sharp(req.file.buffer).resize(300, 300).toFormat("jpeg").jpeg({
        quality: 90
    }).toFile(`public/img/brands/${req.file.filename}`);
    // Save Image to DB
    req.body.image = req.file.filename;
    next();
});
$96ee371c9b4a18ca$export$2a69f7703e082544 = $227fa3de72c027a5$export$2774c37398bee8b2($4107b4ee85fe1447$exports);
$96ee371c9b4a18ca$export$1d2c84409087ed59 = $227fa3de72c027a5$export$2eb5ba9a66e42816($4107b4ee85fe1447$exports);
$96ee371c9b4a18ca$export$64bd7b2eff30d454 = $227fa3de72c027a5$export$5d49599920443c31($4107b4ee85fe1447$exports);
$96ee371c9b4a18ca$export$47a68fa1f6473d7d = $227fa3de72c027a5$export$3220ead45e537228($4107b4ee85fe1447$exports);
$96ee371c9b4a18ca$export$b4ab2ccd2baf1bca = $227fa3de72c027a5$export$36a479340da3c347($4107b4ee85fe1447$exports); // PUT modifies a record's information and creates a new record if one is not available, and PATCH updates a resource without sending the entire body in the request.
 // PATCH can save you some bandwidth, as updating a field with PATCH means less data being transferred than sending the whole record with PUT.


var $0a5cedea8a5949aa$export$64702f49237545d3;
var $0a5cedea8a5949aa$export$3b6fed2632fcbcb2;
var $0a5cedea8a5949aa$export$c9a8d73fae2d583c;
var $0a5cedea8a5949aa$export$b3ae78adf9ce3211;

var $0a5cedea8a5949aa$require$check = $hXvsm$expressvalidator.check;

$0a5cedea8a5949aa$export$64702f49237545d3 = [
    $0a5cedea8a5949aa$require$check("id").isMongoId().withMessage(`Invalid Object ID format!`),
    $76b9bbcfebdd77b8$export$fe6394b7002cf45e
];
$0a5cedea8a5949aa$export$3b6fed2632fcbcb2 = [
    $0a5cedea8a5949aa$require$check("name").notEmpty().withMessage("Each Brand must have a Name!").isLength({
        min: 3,
        max: 50
    }).withMessage("Each Brand Name must be between 3 and 50 characters"),
    $76b9bbcfebdd77b8$export$fe6394b7002cf45e
];
$0a5cedea8a5949aa$export$c9a8d73fae2d583c = [
    $0a5cedea8a5949aa$require$check("id").isMongoId().withMessage(`Invalid Object ID format!`),
    $0a5cedea8a5949aa$require$check("name").optional().isLength({
        min: 3,
        max: 50
    }).withMessage("Each Brand Name must be between 3 and 30 characters"),
    $76b9bbcfebdd77b8$export$fe6394b7002cf45e
];
$0a5cedea8a5949aa$export$b3ae78adf9ce3211 = [
    $0a5cedea8a5949aa$require$check("id").isMongoId().withMessage(`Invalid Object ID format!`),
    $76b9bbcfebdd77b8$export$fe6394b7002cf45e
];



/*************************************************************************/ const $ddfe60ef2f51e535$var$router = $hXvsm$express.Router();
$ddfe60ef2f51e535$var$router.route("/").get($ce487c6e3030a219$export$eda7ca9e36571553, $96ee371c9b4a18ca$export$2a69f7703e082544).post($ce487c6e3030a219$export$eda7ca9e36571553, $ce487c6e3030a219$export$e1bac762c84d3b0c("admin", "manager"), $96ee371c9b4a18ca$export$b47bd20998c03c20, $96ee371c9b4a18ca$export$e41bb0ffefb64a19, $0a5cedea8a5949aa$export$3b6fed2632fcbcb2, $96ee371c9b4a18ca$export$64bd7b2eff30d454);
$ddfe60ef2f51e535$var$router.route("/:id").get($0a5cedea8a5949aa$export$64702f49237545d3, $96ee371c9b4a18ca$export$1d2c84409087ed59).patch($ce487c6e3030a219$export$eda7ca9e36571553, $ce487c6e3030a219$export$e1bac762c84d3b0c("admin", "manager"), $96ee371c9b4a18ca$export$b47bd20998c03c20, $96ee371c9b4a18ca$export$e41bb0ffefb64a19, $0a5cedea8a5949aa$export$c9a8d73fae2d583c, $96ee371c9b4a18ca$export$47a68fa1f6473d7d).delete($ce487c6e3030a219$export$eda7ca9e36571553, $ce487c6e3030a219$export$e1bac762c84d3b0c("admin"), $0a5cedea8a5949aa$export$b3ae78adf9ce3211, $96ee371c9b4a18ca$export$b4ab2ccd2baf1bca);
$ddfe60ef2f51e535$exports = $ddfe60ef2f51e535$var$router;


var $b4959900d73918b4$exports = {};

// const asyncHandler = require('express-async-handler');
// const AppError = require('../utilities/appError');
/**********************************************************************************/ // @desc		Get All coupons
// @route 	GET  /api/v1/coupons
// @access	Private --> (Admin, Manager)
var $778afa0797b863bf$export$3fec7e477f605ef3;
// @desc		Get a Single Coupon
// @route 	GET  /api/v1/coupons/:id
// @access	Private --> (Admin, Manager)
var $778afa0797b863bf$export$1ae39e21f75527d3;
// @desc		Create Coupon
// @route 	POST  /api/v1/coupons
// @access	Private --> (Admin, Manager)
var $778afa0797b863bf$export$c8fd66f08d49a7e2;
// @desc		Update Specific Coupon
// @route 	PATCH  /api/v1/coupons/:id
// @access	Private --> (Admin, Manager)
var $778afa0797b863bf$export$9602ed13573853a2;
// @desc		Delete Specific Coupon
// @route 	DELETE  /api/v1/coupons/:id
// @access	Private --> (Admin, Manager)
var $778afa0797b863bf$export$4793f975f44920d;
var $9cba5631b8a35fe5$exports = {};

const { Schema: $9cba5631b8a35fe5$var$Schema } = $hXvsm$mongoose;
//1- Create Schema
const $9cba5631b8a35fe5$var$couponSchema = new $9cba5631b8a35fe5$var$Schema({
    name: {
        type: String,
        required: [
            true,
            "Each Coupon must have a name!"
        ],
        unique: true,
        trim: true,
        lowercase: true
    },
    expires: {
        type: Date,
        // required: [true, `Each Coupon must have an expiration date`],
        default: Date.now() + 1728000000
    },
    discount: {
        type: Number,
        required: [
            true,
            `Each Coupon must have a discount percentage`
        ],
        min: 0,
        max: 100
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    }
});
//------------------------------------------------------------------------
//2- Create Model
$9cba5631b8a35fe5$exports = $hXvsm$mongoose.model("Coupon", $9cba5631b8a35fe5$var$couponSchema);



$778afa0797b863bf$export$3fec7e477f605ef3 = $227fa3de72c027a5$export$2774c37398bee8b2($9cba5631b8a35fe5$exports);
$778afa0797b863bf$export$1ae39e21f75527d3 = $227fa3de72c027a5$export$2eb5ba9a66e42816($9cba5631b8a35fe5$exports);
$778afa0797b863bf$export$c8fd66f08d49a7e2 = $227fa3de72c027a5$export$5d49599920443c31($9cba5631b8a35fe5$exports);
$778afa0797b863bf$export$9602ed13573853a2 = $227fa3de72c027a5$export$3220ead45e537228($9cba5631b8a35fe5$exports);
$778afa0797b863bf$export$4793f975f44920d = $227fa3de72c027a5$export$36a479340da3c347($9cba5631b8a35fe5$exports); // PUT modifies a record's information and creates a new record if one is not available, and PATCH updates a resource without sending the entire body in the request.
 // PATCH can save you some bandwidth, as updating a field with PATCH means less data being transferred than sending the whole record with PUT.


var $9276977a16eb31b0$export$83689e87d9f6c02;
var $9276977a16eb31b0$export$521bb6a8790a6d3e;
var $9276977a16eb31b0$export$ff9b46c8dda0e209;
var $9276977a16eb31b0$export$9972cfed31eb7b9e;

var $9276977a16eb31b0$require$check = $hXvsm$expressvalidator.check;



$9276977a16eb31b0$export$83689e87d9f6c02 = [
    $9276977a16eb31b0$require$check("id").isMongoId().withMessage(`Invalid Object ID format!`),
    $76b9bbcfebdd77b8$export$fe6394b7002cf45e
];
$9276977a16eb31b0$export$521bb6a8790a6d3e = [
    $9276977a16eb31b0$require$check("name").notEmpty().withMessage("Each Coupon must have a Name!").custom(async (val)=>{
        const coupon = await $9cba5631b8a35fe5$exports.findOne({
            name: val
        });
        if (coupon) throw new $7c7a5bb37ebf3b57$exports("This Coupon is already in intiated", 400);
        return true;
    }),
    $9276977a16eb31b0$require$check("expires").optional().isDate({
        format: "MM-DD-YYYY",
        strict: true
    }).withMessage("Invalid Date format... Try ('MM-DD-YYYY') Format").custom(async (val)=>{
        const expireDate = Date.parse(val);
        const tommorrow = Date.now() + 86400000;
        if (expireDate <= tommorrow) throw new $7c7a5bb37ebf3b57$exports("The Coupon expiration date must be valid for at least 24 hours", 400);
        return true;
    }),
    $9276977a16eb31b0$require$check("discount").notEmpty().withMessage("Each Coupon must have a discount value between 1 and 100").isNumeric().isLength({
        min: 1,
        max: 100
    }).withMessage("discount value must be between 1 and 100"),
    $76b9bbcfebdd77b8$export$fe6394b7002cf45e
];
$9276977a16eb31b0$export$ff9b46c8dda0e209 = [
    $9276977a16eb31b0$require$check("id").isMongoId().withMessage(`Invalid Object ID format!`),
    $9276977a16eb31b0$require$check("name").optional().custom(async (val)=>{
        const coupon = await $9cba5631b8a35fe5$exports.findOne({
            name: val
        });
        if (coupon) throw new $7c7a5bb37ebf3b57$exports("This Coupon is already in intiated", 400);
        return true;
    }),
    $9276977a16eb31b0$require$check("expires").optional().isDate({
        format: "MM-DD-YYYY",
        strict: true
    }).withMessage("Invalid Date format... Try ('mm-dd-yyyy') Format").custom(async (val, { req: req })=>{
        const coupon = await $9cba5631b8a35fe5$exports.findById(req.params.id);
        const expireDate = Date.parse(val);
        const updatedAt = Date.parse(coupon.updatedAt) + 43200000;
        // const tommorrow = Date.now() + 12 * 60 * 60 * 1000;
        if (expireDate <= updatedAt) throw new $7c7a5bb37ebf3b57$exports("The Coupon expiration date must be valid for at least 12 hours of being created or updated", 400);
        // if (expireDate <= tommorrow) {
        // 	throw new AppError(
        // 		'The Coupon expiration date must be valid for at least another 12 hours',
        // 		400,
        // 	);
        // }
        return true;
    }),
    $9276977a16eb31b0$require$check("discount").optional().isNumeric().isLength({
        min: 1,
        max: 100
    }).withMessage("discount value must be between 1 and 100"),
    $76b9bbcfebdd77b8$export$fe6394b7002cf45e
];
$9276977a16eb31b0$export$9972cfed31eb7b9e = [
    $9276977a16eb31b0$require$check("id").isMongoId().withMessage(`Invalid Object ID format!`),
    $76b9bbcfebdd77b8$export$fe6394b7002cf45e
];



/*************************************************************************/ const $b4959900d73918b4$var$router = $hXvsm$express.Router();
$b4959900d73918b4$var$router.use($ce487c6e3030a219$export$eda7ca9e36571553, $ce487c6e3030a219$export$e1bac762c84d3b0c("admin", "manager"));
$b4959900d73918b4$var$router.route("/").get($778afa0797b863bf$export$3fec7e477f605ef3).post($9276977a16eb31b0$export$521bb6a8790a6d3e, $778afa0797b863bf$export$c8fd66f08d49a7e2);
$b4959900d73918b4$var$router.route("/:id").get($9276977a16eb31b0$export$83689e87d9f6c02, $778afa0797b863bf$export$1ae39e21f75527d3).patch($9276977a16eb31b0$export$ff9b46c8dda0e209, $778afa0797b863bf$export$9602ed13573853a2).delete($9276977a16eb31b0$export$9972cfed31eb7b9e, $778afa0797b863bf$export$4793f975f44920d);
$b4959900d73918b4$exports = $b4959900d73918b4$var$router;


var $b14a6d4adc0e87b7$exports = {};

/* eslint-disable node/no-unsupported-features/es-syntax */ /* eslint-disable import/no-extraneous-dependencies */ // const AppError = require('../utilities/appError');
/***********************************************************************/ // @desc		Get All Reviews
// @route 	GET  /api/v1/reviews
// @access	Public
var $e8a2407fbeb25c48$export$98596c466f7b9045;
// @desc		Get a Single Review
// @route 	GET  /api/v1/reviews/:id
// @access	Public
var $e8a2407fbeb25c48$export$c3d3086f9027c35a;
//For createReview Nested route
var $e8a2407fbeb25c48$export$a0626d4a633cb06;
var $e8a2407fbeb25c48$export$70ccfab6c33580eb;
var $e8a2407fbeb25c48$export$5eec69104098579;
// @desc		Create Review
// @route 	POST  /api/v1/reviews
// @access	Private/protect --> (User)
var $e8a2407fbeb25c48$export$e42a3d813dd6123f;
// @desc		Update Specific Review
// @route 	PATCH  /api/v1/reviews/:id
// @access	Private/protect --> (User)
var $e8a2407fbeb25c48$export$7019c694ef9e681d;
// @desc		Delete Specific Review
// @route 	DELETE  /api/v1/reviews/:id
// @access	Private --> (Admin, User)
var $e8a2407fbeb25c48$export$189a68d831f3e4ec;

var $2d4738cec793e542$exports = {};

var $5b845a0164a902e5$exports = {};

const { Schema: $5b845a0164a902e5$var$Schema } = $hXvsm$mongoose;

//1- Create Schema
const $5b845a0164a902e5$var$productSchema = new $5b845a0164a902e5$var$Schema({
    title: {
        type: String,
        required: [
            true,
            "Each Product must have a Title!"
        ],
        trim: true,
        minlength: [
            5,
            "Product Title must be more than 4 characters!"
        ],
        maxlength: [
            120,
            "Product Title must be less than 120 characters!"
        ]
    },
    slug: {
        type: String,
        lowercase: true
    },
    description: {
        type: String,
        required: [
            true,
            "Each Product must have a Description!"
        ],
        minlength: [
            20,
            "Product Description must be morethan 20 characters!"
        ]
    },
    quantity: {
        type: Number,
        required: [
            true,
            "Each Product must have a Quantity!"
        ]
    },
    sold: {
        type: Number,
        default: 0
    },
    ratingsAverage: {
        type: Number,
        default: 3.0,
        min: [
            1,
            "Rating must be a number between 1 and 5!"
        ],
        max: [
            5,
            "Rating must be a number between 1 and 5!"
        ],
        set: (val)=>val.toFixed(2)
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [
            true,
            "Each Product must have a Price!"
        ],
        trim: true
    },
    priceAfterDiscount: {
        type: Number,
        default: function() {
            if (this.price) return this.price;
            return null;
        }
    },
    colors: {
        type: [
            String
        ]
    },
    images: {
        type: [
            String
        ]
    },
    imageCover: {
        type: String,
        required: [
            true,
            "Each Product must have a Cover Image!"
        ]
    },
    category: {
        type: $5b845a0164a902e5$var$Schema.ObjectId,
        ref: "Category",
        required: [
            true,
            "Each Product must belong to a Category!"
        ]
    },
    subCategory: [
        {
            type: $5b845a0164a902e5$var$Schema.ObjectId,
            ref: "SubCategory"
        }
    ],
    brand: {
        type: $5b845a0164a902e5$var$Schema.ObjectId,
        ref: "Brand"
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});
//------------------------------------------------------------------------
//DOCUMENT MIDDLEWARE: runs before or after .save() and .create() but not on .insertMany({})
$5b845a0164a902e5$var$productSchema.pre("save", function(next) {
    if (!this.slug) this.slug = $hXvsm$slugify(this.title);
    next();
});
$5b845a0164a902e5$var$productSchema.pre("findOneAndUpdate", async function(next) {
    const update = this.getUpdate();
    //update slug whenever title is updated
    if (update.title) update.slug = $hXvsm$slugify(update.title, {
        lower: true
    });
    //update priceAfterDiscount if updated price is smaller than current priceAfterDiscount
    if (update.priceAfterDiscount) {
        const product = await this.model.findOne(this.getQuery());
        if (product && update.priceAfterDiscount > product.price) update.priceAfterDiscount = product.price;
    }
    //update priceAfterDiscount if updated price is smaller than current priceAfterDiscount
    if (update.price) {
        const product = await this.model.findOne(this.getQuery());
        if (product && product.priceAfterDiscount > update.price) update.priceAfterDiscount = update.price;
    }
    next();
});
$5b845a0164a902e5$var$productSchema.pre(/^find/, function(next) {
    this.find().select("-createdAt -updatedAt");
    next();
});
$5b845a0164a902e5$var$productSchema.pre(/^find/, function(next) {
    this.populate([
        {
            path: "category",
            select: "name"
        },
        {
            path: "subCategory",
            select: "name"
        },
        {
            path: "brand",
            select: "name"
        }
    ]);
    this.find().select("-createdAt -updatedAt");
    next();
});
// Virtual population for reviews
$5b845a0164a902e5$var$productSchema.virtual("reviews", {
    ref: "Review",
    foreignField: "product",
    localField: "_id"
});
//------------------------------------------------------------------
//Set ImageUrl
const $5b845a0164a902e5$var$setImageUrl = function(doc) {
    if (doc.imageCover) {
        const imageUrl = `${undefined}/img/products/${doc.imageCover}`;
        doc.imageCover = imageUrl;
    }
    if (doc.images) doc.images = doc.images.map((image)=>`${undefined}/img/products/${image}`);
};
// Adjust ImageURL After Retrieving or Updating a document
$5b845a0164a902e5$var$productSchema.post("init", (doc)=>$5b845a0164a902e5$var$setImageUrl(doc));
// Adjust ImageURL After Creating a document
$5b845a0164a902e5$var$productSchema.post("save", (doc)=>$5b845a0164a902e5$var$setImageUrl(doc));
//------------------------------------------------------------------------
//2- Create Model
$5b845a0164a902e5$exports = $hXvsm$mongoose.model("Product", $5b845a0164a902e5$var$productSchema);


const { Schema: $2d4738cec793e542$var$Schema } = $hXvsm$mongoose;
//1- Create Schema
const $2d4738cec793e542$var$reviewSchema = new $2d4738cec793e542$var$Schema({
    title: {
        type: String,
        minlength: [
            3,
            "Review title must be more than 2 characters!"
        ],
        maxlength: [
            60,
            "Review title must be less than 60 characters!"
        ],
        lowercase: true
    },
    ratings: {
        type: Number,
        required: [
            true,
            "Each Review Must be given a rating value!"
        ],
        min: [
            1,
            "Review rating can't be less than 1"
        ],
        max: [
            5,
            "Review rating can't be more than 5"
        ],
        default: 3.0
    },
    user: {
        type: $2d4738cec793e542$var$Schema.ObjectId,
        ref: "User",
        required: [
            true,
            "Each Review must belong to a User"
        ]
    },
    product: {
        type: $2d4738cec793e542$var$Schema.ObjectId,
        ref: "Product",
        required: [
            true,
            "Each Review must belong to a Product"
        ]
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});
//------------------------------------------------------------------------
//DOCUMENT MIDDLEWARE: runs before or after .save() and .create() but not on .insertMany({})
$2d4738cec793e542$var$reviewSchema.pre(/^find/, function(next) {
    this.populate([
        {
            path: "user",
            select: "name"
        }
    ]);
    this.find().select("-createdAt -updatedAt");
    next();
});
//--------------------------------------------------------------------
//Aggregation
$2d4738cec793e542$var$reviewSchema.statics.calcAvgRatingsAndQuantity = async function(productId) {
    const stats = await this.aggregate([
        // Stage 1: Get all reviews for a product
        {
            $match: {
                product: productId
            }
        },
        // Stage 2: group by productId and Calculate averageRatings and ratingsQuantity for products
        {
            $group: {
                _id: "product",
                avgRatings: {
                    $avg: "$ratings"
                },
                ratingsQuantity: {
                    $sum: 1
                }
            }
        }
    ]);
    if (stats.length > 0) await $5b845a0164a902e5$exports.findByIdAndUpdate(productId, {
        ratingsQuantity: stats[0].ratingsQuantity,
        ratingsAverage: stats[0].avgRatings
    });
    else await $5b845a0164a902e5$exports.findByIdAndUpdate(productId, {
        ratingsQuantity: 0,
        ratingsAverage: 3
    });
};
$2d4738cec793e542$var$reviewSchema.post("save", async function() {
    //this points to current review..
    await this.constructor.calcAvgRatingsAndQuantity(this.product);
});
// Surprisingly Did not Work
// reviewSchema.post(/^findOneAnd/, async (doc) => {
// 	if (doc) await doc.constructor.calcAvgRatingsAndQuantity(doc.product._id);
// });
//------------------------------------------------------------------------
//2- Create Model
$2d4738cec793e542$exports = $hXvsm$mongoose.model("Review", $2d4738cec793e542$var$reviewSchema);


$e8a2407fbeb25c48$export$98596c466f7b9045 = $227fa3de72c027a5$export$2774c37398bee8b2($2d4738cec793e542$exports);
$e8a2407fbeb25c48$export$c3d3086f9027c35a = $227fa3de72c027a5$export$2eb5ba9a66e42816($2d4738cec793e542$exports);
$e8a2407fbeb25c48$export$a0626d4a633cb06 = (set)=>(req, res, next)=>{
        if (set === "user") req.body.user = req.body.user || req.user._id;
        if (set === "product") req.body.product = req.body.product || req.params.productId;
        if (set === "both") {
            req.body.user = req.body.user || req.user._id;
            req.body.product = req.body.product || req.params.productId;
        }
        next();
    };
$e8a2407fbeb25c48$export$70ccfab6c33580eb = (req, res, next)=>{
    //Nested Route
    req.body.product = req.body.product || req.params.productId;
    next();
};
$e8a2407fbeb25c48$export$5eec69104098579 = (req, res, next)=>{
    //Nested Route
    req.body.user = req.body.user || req.user._id;
    next();
};
$e8a2407fbeb25c48$export$e42a3d813dd6123f = $227fa3de72c027a5$export$5d49599920443c31($2d4738cec793e542$exports);
$e8a2407fbeb25c48$export$7019c694ef9e681d = $227fa3de72c027a5$export$3220ead45e537228($2d4738cec793e542$exports);
$e8a2407fbeb25c48$export$189a68d831f3e4ec = $227fa3de72c027a5$export$36a479340da3c347($2d4738cec793e542$exports); // PUT modifies a record's information and creates a new record if one is not available, and PATCH updates a resource without sending the entire body in the request.
 // PATCH can save you some bandwidth, as updating a field with PATCH means less data being transferred than sending the whole record with PUT.



/**********************************************************************/ var $f3645d44366249ff$export$af47bf1bec4edcba;
var $f3645d44366249ff$export$807e241202b3c595;
var $f3645d44366249ff$export$b52ac0a8fc63a993;
var $f3645d44366249ff$export$8e61f82b3bc380e7;

var $f3645d44366249ff$require$check = $hXvsm$expressvalidator.check;




$f3645d44366249ff$export$af47bf1bec4edcba = [
    $f3645d44366249ff$require$check("id").isMongoId().withMessage(`Invalid Object ID format!`).custom(async (val)=>{
        const review = await $2d4738cec793e542$exports.findById(val);
        if (!review) throw new $7c7a5bb37ebf3b57$exports("The Review you're seaching for may be deleted or doesn't exist right now!", 404);
    }),
    $76b9bbcfebdd77b8$export$fe6394b7002cf45e
];
$f3645d44366249ff$export$807e241202b3c595 = [
    $f3645d44366249ff$require$check("title").optional().isLength({
        min: 3,
        max: 60
    }).withMessage("Each Review Title must be between 3 and 60 characters"),
    $f3645d44366249ff$require$check("ratings").notEmpty().isNumeric().isFloat({
        min: 1.0,
        max: 5.0
    }).withMessage("Product rating must be between 1.0 and 5.0"),
    $f3645d44366249ff$require$check("user").isMongoId().withMessage(`Invalid Object ID format!`).custom(async (val, { req: req })=>{
        // 1) Check if logged user is the one creating the review
        if (req.user._id.toString() !== val.toString()) throw new $7c7a5bb37ebf3b57$exports("You cannot create a review for another user!", 403);
        // 2) Check if logged user have already created a review
        const review = await $2d4738cec793e542$exports.findOne({
            user: req.user._id,
            product: req.body.product
        });
        if (review) throw new $7c7a5bb37ebf3b57$exports("You have already created a review for this product!", 403);
    }),
    $f3645d44366249ff$require$check("product").isMongoId().withMessage(`Invalid Object ID format!`).custom(async (val, { req: req })=>{
        const product = await $5b845a0164a902e5$exports.findById(req.body.product);
        if (!product) throw new $7c7a5bb37ebf3b57$exports("The Product you want to review may be deleted or doesn't exist right now!", 404);
    }),
    $76b9bbcfebdd77b8$export$fe6394b7002cf45e
];
$f3645d44366249ff$export$b52ac0a8fc63a993 = [
    $f3645d44366249ff$require$check("id").isMongoId().withMessage(`Invalid Object ID format!`).custom(async (val, { req: req })=>{
        // 1) Check if review exists
        const review = await $2d4738cec793e542$exports.findById(val);
        if (!review) return new $7c7a5bb37ebf3b57$exports(`There's no review with the id: ${val}`, 404);
        // 2) Check if review belongs to the logged user
        if (review.user._id.toString() !== req.user._id.toString()) throw new $7c7a5bb37ebf3b57$exports("You are not authorized to update this review!", 403);
    }),
    $f3645d44366249ff$require$check("title").optional().isLength({
        min: 3,
        max: 60
    }).withMessage("Each Review Name must be between 3 and 60 characters"),
    $76b9bbcfebdd77b8$export$fe6394b7002cf45e
];
$f3645d44366249ff$export$8e61f82b3bc380e7 = [
    $f3645d44366249ff$require$check("id").isMongoId().withMessage(`Invalid Object ID format!`).custom(async (val, { req: req })=>{
        if (req.user.role === "user") {
            // 1) Check if review exists
            const review = await $2d4738cec793e542$exports.findById(val);
            if (!review) return new $7c7a5bb37ebf3b57$exports(`There's no review with the id: ${val}`, 404);
            // 2) Check if review belongs to the logged user
            if (review.user._id.toString() !== req.user._id.toString()) throw new $7c7a5bb37ebf3b57$exports("You are not authorized to delete this review!", 403);
        }
        return true;
    }),
    $76b9bbcfebdd77b8$export$fe6394b7002cf45e
];


/*******************************************************************************/ //mergeParams Allow us to access parameeters from other Routers
const $b14a6d4adc0e87b7$var$router = $hXvsm$express.Router({
    mergeParams: true
});
$b14a6d4adc0e87b7$var$router.route("/").get($e8a2407fbeb25c48$export$98596c466f7b9045).post($ce487c6e3030a219$export$eda7ca9e36571553, $ce487c6e3030a219$export$e1bac762c84d3b0c("user"), $e8a2407fbeb25c48$export$a0626d4a633cb06("both"), $f3645d44366249ff$export$807e241202b3c595, $e8a2407fbeb25c48$export$e42a3d813dd6123f);
$b14a6d4adc0e87b7$var$router.route("/:id").get($f3645d44366249ff$export$af47bf1bec4edcba, $e8a2407fbeb25c48$export$c3d3086f9027c35a).patch($ce487c6e3030a219$export$eda7ca9e36571553, $ce487c6e3030a219$export$e1bac762c84d3b0c("user"), $f3645d44366249ff$export$b52ac0a8fc63a993, $e8a2407fbeb25c48$export$7019c694ef9e681d).delete($ce487c6e3030a219$export$eda7ca9e36571553, $ce487c6e3030a219$export$e1bac762c84d3b0c("admin", "user", "manager"), $f3645d44366249ff$export$8e61f82b3bc380e7, $e8a2407fbeb25c48$export$189a68d831f3e4ec);
$b14a6d4adc0e87b7$exports = $b14a6d4adc0e87b7$var$router;


var $0cbb63b28ec796ac$exports = {};

/* eslint-disable node/no-unsupported-features/es-syntax */ /* eslint-disable import/no-extraneous-dependencies */ // const multer = require('multer');
/**********************************************************************************/ //upload Multiple Images
var $b51010bdc65745f6$export$563c33dd32249998;
//--------------------------------------------------------
//--imageProcessing applied on the buffer image in memory
//--while if we stored the image directly to diskStorage then sharp middleware function is not needed
var $b51010bdc65745f6$export$b6d504ce80f0cfed;
/**********************************************************************************/ // @desc		Get All Products
// @route 	GET  /api/v1/products
// @access	Public
var $b51010bdc65745f6$export$f2012bafb0501902;
// @desc		Get a Single Product
// @route 	GET  /api/v1/products/:id
// @access	Public
var $b51010bdc65745f6$export$e2005c9600188ac7;
// @desc		Create Product
// @route 	POST  /api/v1/products
// @access	Private/protect --> (Admin, Manager)
var $b51010bdc65745f6$export$9c734a715e6666d0;
// @desc		Update Specific Product
// @route 	PATCH  /api/v1/products/:id
// @access	Private/protect --> (Admin, Manager)
var $b51010bdc65745f6$export$8d590d0c8872145e;
// @desc		Delete Specific Product
// @route 	DELETE  /api/v1/products/:id
// @access	Private/protect --> (Admin, Manager)
var $b51010bdc65745f6$export$297029b54a55ef2d;



var $b51010bdc65745f6$require$uuidv4 = $hXvsm$uuid.v4;



var $b51010bdc65745f6$require$uploadMultipleImages = $2c9b9452479b6f6f$export$a935ca3be26049b2;
$b51010bdc65745f6$export$563c33dd32249998 = $b51010bdc65745f6$require$uploadMultipleImages([
    {
        name: "imageCover",
        maxCount: 1
    },
    {
        name: "images",
        maxCount: 5
    }
]);
$b51010bdc65745f6$export$b6d504ce80f0cfed = $hXvsm$expressasynchandler(async (req, res, next)=>{
    if (!req.files) return next();
    // Process imageCover
    if (req.files.imageCover) {
        const imageCoverName = `product-${$b51010bdc65745f6$require$uuidv4()}-${Date.now()}-cover.jpeg`;
        await $hXvsm$sharp(req.files.imageCover[0].buffer).resize(2000, 1333).toFormat("jpeg").jpeg({
            quality: 93
        }).toFile(`public/img/products/${imageCoverName}`);
        // Save Image to DB
        req.body.imageCover = imageCoverName;
    }
    // Process images
    if (req.files.images) {
        req.body.images = [];
        await Promise.all(req.files.images.map(async (image)=>{
            const ImageName = `product-${$b51010bdc65745f6$require$uuidv4()}-${Date.now()}.jpeg`;
            await $hXvsm$sharp(image.buffer).resize(800, 800).toFormat("jpeg").jpeg({
                quality: 90
            }).toFile(`public/img/products/${ImageName}`);
            req.body.images.push(ImageName);
        }));
    }
    next();
});
$b51010bdc65745f6$export$f2012bafb0501902 = $227fa3de72c027a5$export$2774c37398bee8b2($5b845a0164a902e5$exports);
$b51010bdc65745f6$export$e2005c9600188ac7 = $227fa3de72c027a5$export$2eb5ba9a66e42816($5b845a0164a902e5$exports, {
    path: "reviews"
});
$b51010bdc65745f6$export$9c734a715e6666d0 = $227fa3de72c027a5$export$5d49599920443c31($5b845a0164a902e5$exports);
$b51010bdc65745f6$export$8d590d0c8872145e = $227fa3de72c027a5$export$3220ead45e537228($5b845a0164a902e5$exports);
$b51010bdc65745f6$export$297029b54a55ef2d = $227fa3de72c027a5$export$36a479340da3c347($5b845a0164a902e5$exports); // PUT modifies a record's information and creates a new record if one is not available, and PATCH updates a resource without sending the entire body in the request.
 // PATCH can save you some bandwidth, as updating a field with PATCH means less data being transferred than sending the whole record with PUT.



/*************************************************************************/ var $564601b9d137f0b8$export$cf9939b856e2087b;
var $564601b9d137f0b8$export$65427459bfbf7c9d;
var $564601b9d137f0b8$export$677af4ff663e5781;
var $564601b9d137f0b8$export$b39eb82cbd50ba0e;

var $564601b9d137f0b8$require$check = $hXvsm$expressvalidator.check;





$564601b9d137f0b8$export$cf9939b856e2087b = [
    $564601b9d137f0b8$require$check("id").isMongoId().withMessage(`Invalid Object ID format!`).custom(async (val)=>{
        const product = await $5b845a0164a902e5$exports.findById(val);
        if (!product) throw new $7c7a5bb37ebf3b57$exports("The Product you're seaching for may be deleted or doesn't exist right now!", 404);
    }),
    $76b9bbcfebdd77b8$export$fe6394b7002cf45e
];
$564601b9d137f0b8$export$65427459bfbf7c9d = [
    $564601b9d137f0b8$require$check("title").notEmpty().withMessage("Each Product must have a title!").isLength({
        min: 5,
        max: 120
    }).withMessage("Each Product Title must be between 5 and 120 characters"),
    $564601b9d137f0b8$require$check("description").notEmpty().withMessage("Each Product must have a description!").isLength({
        min: 20
    }).withMessage("Product description must be morethan 20 characters"),
    $564601b9d137f0b8$require$check("quantity").notEmpty().withMessage("Each Product must have a quantity!").isNumeric().withMessage("Product quantity must be a Number"),
    $564601b9d137f0b8$require$check("sold").optional().isNumeric().withMessage("Sold Products must be saved in a Number"),
    $564601b9d137f0b8$require$check("price").notEmpty().withMessage("Each Product must have a Price!").isNumeric().withMessage("Product Price must be a Number!"),
    $564601b9d137f0b8$require$check("priceAfterDiscount").optional().isNumeric().withMessage("Product Price must be a Number!").isFloat().custom((value, { req: req })=>{
        if (value > req.body.price) throw new $7c7a5bb37ebf3b57$exports("Price after discount can't be greater than the original price", 400);
        return true;
    }),
    $564601b9d137f0b8$require$check("ratingsAverage").optional().isNumeric()//new
    .isFloat().withMessage("ratingsAverage must be a Number!").isLength({
        min: 1,
        max: 5
    }).withMessage("Product Rating must be between 1.0 and 5.0"),
    $564601b9d137f0b8$require$check("ratingsQuantity").optional().isNumeric().withMessage("ratingsQuantity must be a Number!"),
    $564601b9d137f0b8$require$check("colors").optional().isArray().withMessage("Product colors should be an array of strings!"),
    $564601b9d137f0b8$require$check("imageCover").notEmpty().withMessage("Each Product must have a cover Image!"),
    $564601b9d137f0b8$require$check("images").optional().isArray().withMessage("images should be an array of strings!"),
    $564601b9d137f0b8$require$check("category").notEmpty().withMessage("Each Product must belong to a specific category").isMongoId().withMessage("Invalid Object ID format!").custom(async (categoryId, { req: req })=>{
        //Check if categoryId already exists
        const categoryExist = await $c3e51bd3f658e01b$exports.findById(categoryId);
        if (!categoryExist) throw new $7c7a5bb37ebf3b57$exports(`No Category found with the id: ${categoryId} \u{1F615}`, 404);
        return true;
    }),
    $564601b9d137f0b8$require$check("subCategory").optional().isMongoId().withMessage(`Invalid Object ID format!`).custom(async (subCatIds, { req: req })=>{
        //Check if subcategoryId already exists
        const subNotExist = (await Promise.all(subCatIds.map(async (id)=>{
            const subCategory = await $8385e6a8ab18bfe2$exports.findById(id);
            if (!subCategory) return id;
        }))).filter((id)=>id !== undefined);
        if (subNotExist.length > 0) throw new $7c7a5bb37ebf3b57$exports(`No Sub-Category found with the id(s): ${subNotExist.join(", ")} \u{1F615}`, 404);
        return true;
    }).custom(async (InputsubCatIds, { req: req })=>{
        //Get all subcategoryIds in the given category id in the product schema
        const subCatDocs = await $8385e6a8ab18bfe2$exports.find({
            category: req.body.category
        });
        // Map all category's subCategories ids to an array
        const orgSubCatIds = subCatDocs.map((val)=>val.id);
        // Check if all InputsubCatIds exist in orgCategoryIds
        const allExist = InputsubCatIds.every((id)=>orgSubCatIds.includes(id));
        // Throw error if any of InputsubCatIds doesnot belong to the category's subcategories
        if (!allExist) {
            const falsyIds = InputsubCatIds.filter((id)=>!orgSubCatIds.includes(id));
            throw new $7c7a5bb37ebf3b57$exports(`The following Sub-Category IDs: [${falsyIds.join(", ")}] ---> don't exist in Category: "${req.body.category}" \u{1F615}`, 404);
        }
        return true;
    }),
    $564601b9d137f0b8$require$check("brand").optional().isMongoId().withMessage("Invalid Object ID format!"),
    $76b9bbcfebdd77b8$export$fe6394b7002cf45e
];
$564601b9d137f0b8$export$677af4ff663e5781 = [
    $564601b9d137f0b8$require$check("id").isMongoId().withMessage(`Invalid Object ID format!`).custom(async (val)=>{
        const product = await $5b845a0164a902e5$exports.findById(val);
        if (!product) throw new $7c7a5bb37ebf3b57$exports("The Product you're seaching for may be deleted or doesn't exist right now!", 404);
        return true;
    }),
    $76b9bbcfebdd77b8$export$fe6394b7002cf45e
];
$564601b9d137f0b8$export$b39eb82cbd50ba0e = [
    $564601b9d137f0b8$require$check("id").isMongoId().withMessage(`Invalid Object ID format!`).custom(async (val)=>{
        const product = await $5b845a0164a902e5$exports.findById(val);
        if (!product) throw new $7c7a5bb37ebf3b57$exports("The Product you're seaching for may be deleted or doesn't exist right now!", 404);
        return true;
    }),
    $76b9bbcfebdd77b8$export$fe6394b7002cf45e
];



/*************************************************************************/ const $0cbb63b28ec796ac$var$router = $hXvsm$express.Router();
//                     <<<< Nested Routes >>>>
//GET      /api/v1/products/:productId/reviews (To get child based on a parent)
//POST     /api/v1/products/:productId/reviews
$0cbb63b28ec796ac$var$router.use("/:productId/reviews", $b14a6d4adc0e87b7$exports);
$0cbb63b28ec796ac$var$router.route("/").get($b51010bdc65745f6$export$f2012bafb0501902).post($ce487c6e3030a219$export$eda7ca9e36571553, $ce487c6e3030a219$export$e1bac762c84d3b0c("admin", "manager"), $b51010bdc65745f6$export$563c33dd32249998, $b51010bdc65745f6$export$b6d504ce80f0cfed, $564601b9d137f0b8$export$65427459bfbf7c9d, $b51010bdc65745f6$export$9c734a715e6666d0);
$0cbb63b28ec796ac$var$router.route("/:id").get($564601b9d137f0b8$export$cf9939b856e2087b, $b51010bdc65745f6$export$e2005c9600188ac7).patch($ce487c6e3030a219$export$eda7ca9e36571553, $ce487c6e3030a219$export$e1bac762c84d3b0c("admin", "manager"), $b51010bdc65745f6$export$563c33dd32249998, $b51010bdc65745f6$export$b6d504ce80f0cfed, $564601b9d137f0b8$export$677af4ff663e5781, $b51010bdc65745f6$export$8d590d0c8872145e).delete($ce487c6e3030a219$export$eda7ca9e36571553, $ce487c6e3030a219$export$e1bac762c84d3b0c("admin"), $564601b9d137f0b8$export$b39eb82cbd50ba0e, $b51010bdc65745f6$export$297029b54a55ef2d);
$0cbb63b28ec796ac$exports = $0cbb63b28ec796ac$var$router;


var $6495ec4508b63af1$exports = {};

/* eslint-disable node/no-unsupported-features/es-syntax */ /* eslint-disable import/no-extraneous-dependencies */ /**********************************************************************************/ //upload Single Image
var $9d2c5b801713c0c3$export$1521787d07bf139d;
//--------------------------------------------------------
//--imageProcessing applied on the buffer image in memory
//--while if we stored the image directly to diskStorage then sharp middleware function is not needed
var $9d2c5b801713c0c3$export$f3b4b59f2e6e5592;
//-----------------------------------------------------------------
// 2) Routes for User managing Himself
// لما ربنا يفرجها و نعمل تسجيل دخول و الحاجات دي
// exports.updateMe = asyncHandler(async (req, res, next) => {
// 	const inputData = Object.keys(req.body).join(' ').toLowerCase();
// 	// 1) Create error if user Post Password data
// 	if (/password/.test(inputData)) {
// 		return next(
// 			new AppError(
// 				'This route is not for password update, please use /updatePassword',
// 				403,
// 			),
// 		);
// 	}
// 	//2) Filter unwanted fields names that are not allowed to be updated
// 	const filteredData = filterObj(req.body, 'name', 'email', 'phone', 'role');
// 	if (req.file) filteredData.photo = req.file.filename;
// 	// 3) Update user document
// 	const updatedUser = await User.findByIdAndUpdate(
// 		req.params.id,
// 		filteredData,
// 		{
// 			new: true,
// 			runValidators: true,
// 		},
// 	);
// 	if (!updatedUser) {
// 		return next(
// 			new AppError(`No User found with the id:${req.params.id}!😞`, 404),
// 		);
// 	}
// 	res.status(200).json({
// 		status: 'success',
// 		data: { user: updatedUser },
// 	});
// });
// لما ربنا يفرجها و نعمل تسجيل دخول و الحاجات دي
// exports.updatePassword = asyncHandler(async (req, res, next) => {
// 	//1) Get the user from collection
// 	const user = await User.findById(req.params.id).select('+password');
// 	if (!user) return next(new AppError('No user found with this ID!😞', 404));
// 	//2) Check if posted current password is correct
// 	if (
// 		!req.body.currentPassword ||
// 		!(await user.correctPassword(req.body.currentPassword, user.password))
// 	) {
// 		return next(new AppError('Please enter a valid current password', 400));
// 	}
// 	//3) check if newPassword and passwordConfirm are available
// 	if (!req.body.newPassword || !req.body.confirmNewPassword) {
// 		return next(
// 			new AppError('Please enter a valid password and confirm it', 400),
// 		);
// 	}
// 	//4) check if password is equal to passwordConfirm
// 	if (req.body.newPassword !== req.body.confirmNewPassword) {
// 		return next(new AppError('New Passwords do not match', 400));
// 	}
// 	const updatedUser = await User.findByIdAndUpdate(req.params.id, {
// 		password: await bcrypt.hash(req.body.newPassword, 12),
// 		passwordConfirm: undefined,
// 	});
// 	res.status(200).json({
// 		status: 'success',
// 		data: { user: updatedUser },
// 	});
// 	// await updatedUser.save();
// });
var $9d2c5b801713c0c3$export$e6af0f282bef35a9;
/**********************************************************************************/ // @desc		Get All users
// @route 	GET  /api/v1/users
// @access	Private --> (Admin, Manager)
var $9d2c5b801713c0c3$export$69093b9c569a5b5b;
// @desc		Get a Single User
// @route 	GET  /api/v1/users/:id
// @access	Private --> (Admin)
var $9d2c5b801713c0c3$export$7cbf767827cd68ba;
// @desc		Create User
// @route 	POST  /api/v1/users
// @access	Private --> (Admin)
// exports.createUser = factory.createOne(User);
var $9d2c5b801713c0c3$export$3493b8991d49f558;
// @desc		Update Specific User			//Don't Change Password with this route
// @route 	PATCH  /api/v1/users/:id
// @access	Private --> (Admin)
var $9d2c5b801713c0c3$export$e3ac7a5d19605772;
// @desc		Delete Specific User
// @route 	DELETE  /api/v1/users/:id
// @access	Private --> (Admin)
var $9d2c5b801713c0c3$export$7d0f10f273c0438a;
//----------------------------------------------------------------
// ( USER MANAGMENT ROUTES )
// @desc		Get logged user data
// @route 	GET  /api/v1/users/getMe
// @access	Private/protect --> (logged in user)
var $9d2c5b801713c0c3$export$dd7946daa6163e94;
// @desc		Update logged user Password
// @route 	PATCH  /api/v1/users/updateMyPassword
// @access	Private/protect --> (logged in user)
var $9d2c5b801713c0c3$export$b1f51295bbcc9435;
// @desc		Update logged user data (except: password vars, role)
// @route 	PATCH  /api/v1/users/updateMe
// @access	Private/protect --> (logged in user)
var $9d2c5b801713c0c3$export$8ddaddf355aae59c;
// @desc		Deactivate logged user
// @route 	DELETE  /api/v1/users/deleteMe
// @access	Private/protect --> (logged in user)
var $9d2c5b801713c0c3$export$8788023029506852;



var $9d2c5b801713c0c3$require$uuidv4 = $hXvsm$uuid.v4;



var $9d2c5b801713c0c3$require$uploadSingleImage = $2c9b9452479b6f6f$export$88dda684c83f14b5;



$9d2c5b801713c0c3$export$1521787d07bf139d = $9d2c5b801713c0c3$require$uploadSingleImage("profilePicture");
$9d2c5b801713c0c3$export$f3b4b59f2e6e5592 = $hXvsm$expressasynchandler(async (req, res, next)=>{
    if (!req.file) return next();
    req.file.filename = `user-${$9d2c5b801713c0c3$require$uuidv4()}-${Date.now()}.jpeg`;
    await $hXvsm$sharp(req.file.buffer).resize(600, 600).toFormat("jpeg").jpeg({
        quality: 98
    }).toFile(`public/img/users/${req.file.filename}`);
    // Save Image to DB
    req.body.profilePicture = req.file.filename;
    next();
});
/**********************************************************************************/ // 1) Helper functions
const $9d2c5b801713c0c3$var$filterObj = (obj, ...allowedFields)=>{
    const newObj = {};
    Object.keys(obj).forEach((el)=>{
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};
$9d2c5b801713c0c3$export$e6af0f282bef35a9 = $hXvsm$expressasynchandler(async (req, res, next)=>{
    const doc = await $ca4b57b91abcd647$exports.findByIdAndUpdate(req.params.id, {
        password: await $hXvsm$bcryptjs.hash(req.body.newPassword, 12),
        passwordConfirm: undefined,
        passwordChangedAt: Date.now()
    }, {
        new: true,
        runValidators: true
    });
    if (!doc) return next(new $7c7a5bb37ebf3b57$exports("No user found with this ID!", 404));
    res.status(200).json({
        status: "success",
        data: {
            user: doc
        }
    });
});
$9d2c5b801713c0c3$export$69093b9c569a5b5b = $227fa3de72c027a5$export$2774c37398bee8b2($ca4b57b91abcd647$exports);
$9d2c5b801713c0c3$export$7cbf767827cd68ba = $227fa3de72c027a5$export$2eb5ba9a66e42816($ca4b57b91abcd647$exports);
$9d2c5b801713c0c3$export$3493b8991d49f558 = (req, res)=>{
    res.status(500).json({
        status: "error",
        message: "This route is Not defined... Please, use /signup route instead"
    });
};
$9d2c5b801713c0c3$export$e3ac7a5d19605772 = $hXvsm$expressasynchandler(async (req, res, next)=>{
    const inputData = Object.keys(req.body).join(" ").toLowerCase();
    // 1) Create error if user Post Password data
    if (/password/.test(inputData)) return next(new $7c7a5bb37ebf3b57$exports("This route is not for password update, please use /updatePassword", 403));
    //2) Filter unwanted fields names that are not allowed to be updated
    const filteredData = $9d2c5b801713c0c3$var$filterObj(req.body, "name", "email", "phone", "role");
    if (req.file) filteredData.profilePicture = req.file.filename;
    // 3) Update user document
    const updatedUser = await $ca4b57b91abcd647$exports.findByIdAndUpdate(req.params.id, filteredData, {
        new: true,
        runValidators: true
    });
    if (!updatedUser) return next(new $7c7a5bb37ebf3b57$exports(`No User found with the id:${req.params.id}!\u{1F61E}`, 404));
    res.status(200).json({
        status: "success",
        data: {
            user: updatedUser
        }
    });
});
$9d2c5b801713c0c3$export$7d0f10f273c0438a = $227fa3de72c027a5$export$36a479340da3c347($ca4b57b91abcd647$exports);
$9d2c5b801713c0c3$export$dd7946daa6163e94 = $hXvsm$expressasynchandler(async (req, res, next)=>{
    req.params.id = req.user._id;
    next();
});
$9d2c5b801713c0c3$export$b1f51295bbcc9435 = $hXvsm$expressasynchandler(async (req, res, next)=>{
    // 1) Update User Password based on payload (req.user._id)
    req.params.id = req.user._id;
    const user = await $ca4b57b91abcd647$exports.findByIdAndUpdate(req.params.id, {
        password: await $hXvsm$bcryptjs.hash(req.body.newPassword, 12),
        passwordConfirm: undefined,
        passwordChangedAt: Date.now()
    }, {
        new: true,
        runValidators: true
    });
    if (!user) return next(new $7c7a5bb37ebf3b57$exports("No user found with this ID!", 404));
    const token = $a5495d4c5996b41b$exports(user._id);
    res.status(200).json({
        status: "success",
        token: token,
        data: {
            user: user
        }
    });
    next();
});
$9d2c5b801713c0c3$export$8ddaddf355aae59c = $hXvsm$expressasynchandler(async (req, res, next)=>{
    // // 1) Update User Data based on payload (req.user._id)
    req.params.id = req.user._id;
    //--> get feilds user want to update
    const inputData = Object.keys(req.body).join(" ").toLowerCase();
    // 2) Create error if user sent Password data
    if (/password/.test(inputData)) return next(new $7c7a5bb37ebf3b57$exports("This route is not for password update, please use /updateMyPassword route instead.", 403));
    // 3) Filter unwanted fields names that are not allowed to be updated
    // const filteredData = filterObj(req.body, 'name', 'email', 'phone');
    // if (req.file) filteredData.profilePicture = req.file.filename;
    // 4) Update user document
    const updatedUser = await $ca4b57b91abcd647$exports.findByIdAndUpdate(req.params.id, // req.user._id,
    {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        profilePicture: req.file ? req.file.filename : req.body.profilePicture
    }, {
        new: true,
        runValidators: true
    });
    if (!updatedUser) return next(new $7c7a5bb37ebf3b57$exports(`No User found with the id:${req.params.id}!\u{1F61E}`, 404));
    res.status(200).json({
        status: "success",
        message: "User is updated successfully!",
        data: {
            user: updatedUser
        }
    });
    next();
});
$9d2c5b801713c0c3$export$8788023029506852 = $hXvsm$expressasynchandler(async (req, res, next)=>{
    // 1) Update User based on payload (req.user._id) to be deactive
    await $ca4b57b91abcd647$exports.findByIdAndUpdate(req.user._id, {
        active: false
    }, {
        new: true,
        runValidators: true
    });
    res.status(204).json({
        status: "success",
        message: "User is Deleted successfully!"
    });
    next();
}); // PUT modifies a record's information and creates a new record if one is not available, and PATCH updates a resource without sending the entire body in the request.
 // PATCH can save you some bandwidth, as updating a field with PATCH means less data being transferred than sending the whole record with PUT.



/* eslint-disable import/no-extraneous-dependencies */ /**************************************************************************/ var $cb4984e90e9de4f2$export$88ed6ce54479a2ac;
var $cb4984e90e9de4f2$export$3cfc32e06a98c64e;
var $cb4984e90e9de4f2$export$5fa90925cebce89;
var $cb4984e90e9de4f2$export$3dc86dec90ffaacf;
var $cb4984e90e9de4f2$export$fdd9a46d762361dc;
var $cb4984e90e9de4f2$export$3ce8f72a44066ba4;
var $cb4984e90e9de4f2$export$c86a68d1854ae8b5;

var $cb4984e90e9de4f2$require$check = $hXvsm$expressvalidator.check;
var $cb4984e90e9de4f2$require$body = $hXvsm$expressvalidator.body;




$cb4984e90e9de4f2$export$88ed6ce54479a2ac = [
    $cb4984e90e9de4f2$require$check("id").isMongoId().withMessage(`Invalid Object ID format!`),
    $76b9bbcfebdd77b8$export$fe6394b7002cf45e
];
$cb4984e90e9de4f2$export$3cfc32e06a98c64e = [
    $cb4984e90e9de4f2$require$check("name").optional().isLength({
        min: 3,
        max: 50
    }).withMessage("Each User Name must be between 3 and 30 characters").custom(async (val)=>{
        const user = await $ca4b57b91abcd647$exports.findOne({
            email: val
        });
        if (user) throw new $7c7a5bb37ebf3b57$exports("This Email Address is already in use", 400);
        return true;
    }),
    $cb4984e90e9de4f2$require$check("email").notEmpty().withMessage("Each User must have an Email!").isEmail().withMessage("Invalid Email address format!").custom(async (val)=>{
        const user = await $ca4b57b91abcd647$exports.findOne({
            email: val
        });
        if (user) throw new $7c7a5bb37ebf3b57$exports("This Email Address is already in use", 400);
        return true;
    }),
    $cb4984e90e9de4f2$require$check("password").notEmpty().withMessage("Each User must have a Strong Password!").isLength({
        min: 8,
        max: 30
    }).withMessage("Each User Name must be between 3 and 30 characters"),
    $cb4984e90e9de4f2$require$check("passwordConfirm").notEmpty().withMessage("You need to confirm your password!").custom(async (val, { req: req })=>{
        if (val !== req.body.password) throw new $7c7a5bb37ebf3b57$exports("Password and PasswordConfirm don't match!", 400);
        return true;
    }),
    $cb4984e90e9de4f2$require$check("phone").optional().isMobilePhone([
        "ar-EG",
        "en-US"
    ]).withMessage("Please enter a valid phone number on the Egyptian format"),
    $cb4984e90e9de4f2$require$check("profilePicture").optional(),
    $cb4984e90e9de4f2$require$check("role").optional(),
    $76b9bbcfebdd77b8$export$fe6394b7002cf45e
];
$cb4984e90e9de4f2$export$5fa90925cebce89 = [
    $cb4984e90e9de4f2$require$check("id").isMongoId().withMessage(`Invalid Object ID format!`),
    $cb4984e90e9de4f2$require$check("name").optional().isLength({
        min: 3,
        max: 50
    }).withMessage("Each User Name must be between 3 and 50 characters"),
    $cb4984e90e9de4f2$require$check("email").optional().isEmail().withMessage("Invalid Email address format!").custom(async (val)=>{
        const user = await $ca4b57b91abcd647$exports.findOne({
            email: val
        });
        if (user) throw new $7c7a5bb37ebf3b57$exports("This Email Address is already in use", 400);
        return true;
    }),
    $cb4984e90e9de4f2$require$check("phone").optional().isMobilePhone([
        "ar-EG",
        "en-US"
    ]).withMessage("Please enter a valid phone number on the Egyptian format"),
    $cb4984e90e9de4f2$require$check("profilePicture").optional(),
    $cb4984e90e9de4f2$require$check("role").optional(),
    $76b9bbcfebdd77b8$export$fe6394b7002cf45e
];
$cb4984e90e9de4f2$export$3dc86dec90ffaacf = [
    $cb4984e90e9de4f2$require$check("name").optional().isLength({
        min: 3,
        max: 50
    }).withMessage("Each User Name must be between 3 and 50 characters"),
    $cb4984e90e9de4f2$require$check("email").optional().isEmail().withMessage("Invalid Email address format!").custom(async (val)=>{
        const user = await $ca4b57b91abcd647$exports.findOne({
            email: val
        });
        if (user) throw new $7c7a5bb37ebf3b57$exports("This Email Address is already in use", 400);
        return true;
    }),
    $cb4984e90e9de4f2$require$check("phone").optional().isMobilePhone([
        "ar-EG",
        "en-US"
    ]).withMessage("Please enter a valid phone number on the Egyptian format"),
    $cb4984e90e9de4f2$require$check("profilePicture").optional(),
    $cb4984e90e9de4f2$require$check("role").optional(),
    $76b9bbcfebdd77b8$export$fe6394b7002cf45e
];
$cb4984e90e9de4f2$export$fdd9a46d762361dc = [
    $cb4984e90e9de4f2$require$check("id").optional().isMongoId().withMessage(`Invalid Object ID format!`),
    $cb4984e90e9de4f2$require$body("currentPassword").notEmpty().withMessage("You must provide your current password").custom(async (val, { req: req })=>{
        // 1) verify current password
        const user = await $ca4b57b91abcd647$exports.findById(req.params.id);
        if (!user) throw new $7c7a5bb37ebf3b57$exports(`No user found with this ID: ${req.params.id}!`, 404);
        const IsCorrectPassword = await $hXvsm$bcryptjs.compare(val, user.password);
        if (!IsCorrectPassword) throw new $7c7a5bb37ebf3b57$exports("Incorrect current password!", 401);
    }),
    $cb4984e90e9de4f2$require$body("newPassword").notEmpty().withMessage("You must provide your new password").isLength({
        min: 8,
        max: 70
    }).withMessage("Your password has to be at least 8 characters long"),
    $cb4984e90e9de4f2$require$body("confirmNewPassword").notEmpty().withMessage("You must provide your new password confirmation").custom(async (val, { req: req })=>{
        // 2) verify that new password and confirm password match
        if (val !== req.body.newPassword) throw new $7c7a5bb37ebf3b57$exports("New Password and Password Confirmation don't match!", 400);
        return true;
    }),
    $76b9bbcfebdd77b8$export$fe6394b7002cf45e
];
$cb4984e90e9de4f2$export$3ce8f72a44066ba4 = [
    $cb4984e90e9de4f2$require$body("currentPassword").notEmpty().withMessage("You must provide your current password").custom(async (val, { req: req })=>{
        // 1) verify current password
        const user = await $ca4b57b91abcd647$exports.findById(req.user._id);
        if (!user) throw new $7c7a5bb37ebf3b57$exports(`No user found with this ID: ${req.user._id}!`, 404);
        const IsCorrectPassword = await $hXvsm$bcryptjs.compare(val, user.password);
        if (!IsCorrectPassword) throw new $7c7a5bb37ebf3b57$exports("Incorrect current password!", 401);
    }),
    $cb4984e90e9de4f2$require$body("newPassword").notEmpty().withMessage("You must provide your new password").isLength({
        min: 8,
        max: 70
    }).withMessage("Your password has to be at least 8 characters long"),
    $cb4984e90e9de4f2$require$body("confirmNewPassword").notEmpty().withMessage("You must provide your new password confirmation").custom(async (val, { req: req })=>{
        // 2) verify that new password and confirm password match
        if (val !== req.body.newPassword) throw new $7c7a5bb37ebf3b57$exports("New Password and Password Confirmation don't match!", 400);
        return true;
    }),
    $76b9bbcfebdd77b8$export$fe6394b7002cf45e
];
$cb4984e90e9de4f2$export$c86a68d1854ae8b5 = [
    $cb4984e90e9de4f2$require$check("id").isMongoId().withMessage(`Invalid Object ID format!`),
    $76b9bbcfebdd77b8$export$fe6394b7002cf45e
];


/*************************************************************************/ const $6495ec4508b63af1$var$router = $hXvsm$express.Router();
// 1) Only logged in users can access these routes
/*---------------*/ $6495ec4508b63af1$var$router.use($ce487c6e3030a219$export$eda7ca9e36571553); /*---------------*/ 
$6495ec4508b63af1$var$router.get("/getMe", $9d2c5b801713c0c3$export$dd7946daa6163e94, $9d2c5b801713c0c3$export$7cbf767827cd68ba);
$6495ec4508b63af1$var$router.patch("/updateMyPassword", $cb4984e90e9de4f2$export$3ce8f72a44066ba4, $9d2c5b801713c0c3$export$b1f51295bbcc9435);
$6495ec4508b63af1$var$router.patch("/updateMe", $9d2c5b801713c0c3$export$1521787d07bf139d, $9d2c5b801713c0c3$export$f3b4b59f2e6e5592, $cb4984e90e9de4f2$export$3dc86dec90ffaacf, $9d2c5b801713c0c3$export$8ddaddf355aae59c);
$6495ec4508b63af1$var$router.delete("/deleteMe", $9d2c5b801713c0c3$export$8788023029506852);
//------------------------------------------------------------------------
// 2) Only admins and managers roles can access these routes
/*------*/ $6495ec4508b63af1$var$router.use($ce487c6e3030a219$export$e1bac762c84d3b0c("admin", "manager")); /*------*/ 
$6495ec4508b63af1$var$router.route("/").get($9d2c5b801713c0c3$export$69093b9c569a5b5b).post($9d2c5b801713c0c3$export$1521787d07bf139d, $9d2c5b801713c0c3$export$f3b4b59f2e6e5592, $cb4984e90e9de4f2$export$3cfc32e06a98c64e, $9d2c5b801713c0c3$export$3493b8991d49f558);
$6495ec4508b63af1$var$router.route("/:id").get($cb4984e90e9de4f2$export$88ed6ce54479a2ac, $9d2c5b801713c0c3$export$7cbf767827cd68ba).patch($9d2c5b801713c0c3$export$1521787d07bf139d, $9d2c5b801713c0c3$export$f3b4b59f2e6e5592, $cb4984e90e9de4f2$export$5fa90925cebce89, $9d2c5b801713c0c3$export$e3ac7a5d19605772).delete($cb4984e90e9de4f2$export$c86a68d1854ae8b5, $9d2c5b801713c0c3$export$7d0f10f273c0438a);
$6495ec4508b63af1$var$router.patch("/updateUserPassword/:id", $cb4984e90e9de4f2$export$fdd9a46d762361dc, $9d2c5b801713c0c3$export$e6af0f282bef35a9);
$6495ec4508b63af1$exports = $6495ec4508b63af1$var$router;


var $90c3243559758cae$exports = {};


/* eslint-disable import/no-extraneous-dependencies */ /**************************************************************************/ var $d0beaba2fbe65072$export$5dbd72fe6fec21ba;
var $d0beaba2fbe65072$export$9eb2904ef1207b7f;
var $d0beaba2fbe65072$export$f0db4d32da779ffe;

var $d0beaba2fbe65072$require$check = $hXvsm$expressvalidator.check;



$d0beaba2fbe65072$export$5dbd72fe6fec21ba = [
    $d0beaba2fbe65072$require$check("name").optional().isLength({
        min: 3,
        max: 50
    }).withMessage("Each User Name must be between 3 and 30 characters").custom(async (val)=>{
        const user = await $ca4b57b91abcd647$exports.findOne({
            email: val
        });
        if (user) throw new $7c7a5bb37ebf3b57$exports("This Email Address is already in use", 400);
        return true;
    }),
    $d0beaba2fbe65072$require$check("email").notEmpty().withMessage("Each User must have an Email!").isEmail().withMessage("Invalid Email address format!"),
    $d0beaba2fbe65072$require$check("password").notEmpty().withMessage("Each User must have a Strong Password!").isLength({
        min: 8,
        max: 30
    }).withMessage("Your Password must be at least 8 characters"),
    $d0beaba2fbe65072$require$check("passwordConfirm").notEmpty().withMessage("You need to confirm your password!").custom(async (val, { req: req })=>{
        if (val !== req.body.password) throw new $7c7a5bb37ebf3b57$exports("Password and PasswordConfirm don't match!", 400);
        return true;
    }),
    $d0beaba2fbe65072$require$check("phone").optional().isMobilePhone([
        "ar-EG",
        "en-US"
    ]).withMessage("Please enter a valid phone number on the Egyptian format"),
    $d0beaba2fbe65072$require$check("profilePicture").optional(),
    $d0beaba2fbe65072$require$check("role").optional(),
    $76b9bbcfebdd77b8$export$fe6394b7002cf45e
];
$d0beaba2fbe65072$export$9eb2904ef1207b7f = [
    $d0beaba2fbe65072$require$check("email").notEmpty().withMessage("Please Enter a valid email").isEmail().withMessage("Invalid Email address format!"),
    $d0beaba2fbe65072$require$check("password").notEmpty().withMessage("Please Enter a valid password"),
    $76b9bbcfebdd77b8$export$fe6394b7002cf45e
];
$d0beaba2fbe65072$export$f0db4d32da779ffe = [
    $d0beaba2fbe65072$require$check("email").notEmpty().withMessage("you've to enter your email!").isEmail().withMessage("Invalid Email address format!"),
    $d0beaba2fbe65072$require$check("password").notEmpty().withMessage("Each User must have a Strong Password!").isLength({
        min: 8,
        max: 30
    }).withMessage("Your Password must be at least 8 characters"),
    $d0beaba2fbe65072$require$check("passwordConfirm").notEmpty().withMessage("You need to confirm your password!").custom(async (val, { req: req })=>{
        if (val !== req.body.password) throw new $7c7a5bb37ebf3b57$exports("Password and PasswordConfirm don't match!", 400);
        return true;
    }),
    $76b9bbcfebdd77b8$export$fe6394b7002cf45e
];


/*************************************************************************/ const $90c3243559758cae$var$router = $hXvsm$express.Router();
$90c3243559758cae$var$router.post("/signup", $d0beaba2fbe65072$export$5dbd72fe6fec21ba, $ce487c6e3030a219$export$7200a869094fec36);
$90c3243559758cae$var$router.post("/login", $d0beaba2fbe65072$export$9eb2904ef1207b7f, $ce487c6e3030a219$export$596d806903d1f59e);
$90c3243559758cae$var$router.post("/forgotPassword", $ce487c6e3030a219$export$66791fb2cfeec3e);
$90c3243559758cae$var$router.post("/verifyResetCode", $ce487c6e3030a219$export$5015bc4d379e799b);
$90c3243559758cae$var$router.patch("/resetPassword", $d0beaba2fbe65072$export$f0db4d32da779ffe, $ce487c6e3030a219$export$dc726c8e334dd814);
$90c3243559758cae$exports = $90c3243559758cae$var$router;


var $499255b1b659a685$exports = {};

/************************************************************************/ // @desc		Get Products in wishlist
// @route 	GET  /api/v1/whishlist
// @access	Private --> (User)
var $c06576b941852e88$export$c6fa6a061f7eb1ac;
// @desc		Add Product to wishlist
// @route 	POST  /api/v1/whishlist
// @access	Private --> (User)
var $c06576b941852e88$export$c07f11cc9cf44f02;
// @desc		Remove Product from wishlist
// @route 	DELETE  /api/v1/whishlist/:productId
// @access	Private --> (User)
var $c06576b941852e88$export$e6a4ade4ad9e6e8;



$c06576b941852e88$export$c6fa6a061f7eb1ac = $hXvsm$expressasynchandler(async (req, res, next)=>{
    const user = await $ca4b57b91abcd647$exports.findById(req.user._id).populate("wishlist", "title ratingsAverage price imageCover");
    if (!user) return next(new $7c7a5bb37ebf3b57$exports(`No User found with the id:${req.user._id}!\u{1F61E}`, 404));
    res.status(200).json({
        status: "success",
        wishlist: user.wishlist
    });
});
$c06576b941852e88$export$c07f11cc9cf44f02 = $hXvsm$expressasynchandler(async (req, res, next)=>{
    const user = await $ca4b57b91abcd647$exports.findByIdAndUpdate(req.user._id, {
        // $addToSet ==> adds productId to wishlist array if productId doesn't exist
        $addToSet: {
            wishlist: req.body.productId
        }
    }, {
        new: true,
        runValidators: true
    });
    if (!user) return next(new $7c7a5bb37ebf3b57$exports(`No User found with the id:${req.user._id}!\u{1F61E}`, 404));
    res.status(201).json({
        status: "success",
        message: "Product was successfully added to your wishlist",
        data: {
            wishlist: user.wishlist
        }
    });
});
$c06576b941852e88$export$e6a4ade4ad9e6e8 = $hXvsm$expressasynchandler(async (req, res, next)=>{
    const user = await $ca4b57b91abcd647$exports.findByIdAndUpdate(req.user._id, {
        // $pull ==> removes productId from wishlist array if productId exists
        $pull: {
            wishlist: req.params.productId
        }
    }, {
        new: true,
        runValidators: true
    });
    if (!user) return next(new $7c7a5bb37ebf3b57$exports(`No User found with the id:${req.user._id}!\u{1F61E}`, 404));
    res.status(200).json({
        status: "success",
        message: "Product was successfully removed from your wishlist",
        data: {
            wishlist: user.wishlist
        }
    });
});



/***********************************************************************/ var $5f54147f8c3b9f85$export$36c6c256c97619fc;
var $5f54147f8c3b9f85$export$67a81f8656c72688;

var $5f54147f8c3b9f85$require$check = $hXvsm$expressvalidator.check;




$5f54147f8c3b9f85$export$36c6c256c97619fc = [
    $5f54147f8c3b9f85$require$check("productId").isMongoId().withMessage("Invalid Object ID format!").notEmpty().withMessage("please provide valid product ID to be added to the wishlist").custom(async (val)=>{
        const product = await $5b845a0164a902e5$exports.findById(val);
        if (!product) throw new $7c7a5bb37ebf3b57$exports("Product you're trying to add to the wishlist, doesn't exist!", 404);
        return true;
    }),
    $76b9bbcfebdd77b8$export$fe6394b7002cf45e
];
$5f54147f8c3b9f85$export$67a81f8656c72688 = [
    $5f54147f8c3b9f85$require$check("productId").isMongoId().withMessage("Invalid Object ID format!").notEmpty().withMessage("please provide valid product ID to be removed from your wishlist").custom(async (val, { req: req })=>{
        const user = await $ca4b57b91abcd647$exports.findById(req.user._id);
        if (!user.wishlist.includes(val.toString())) throw new $7c7a5bb37ebf3b57$exports("Product you're trying to remove from the wishlist, doesn't exist in your wishlist!", 404);
        return true;
    }),
    $76b9bbcfebdd77b8$export$fe6394b7002cf45e
];


/*************************************************************************/ const $499255b1b659a685$var$router = $hXvsm$express.Router();
// Apply middleware to protect all routes
$499255b1b659a685$var$router.use($ce487c6e3030a219$export$eda7ca9e36571553, $ce487c6e3030a219$export$e1bac762c84d3b0c("user"));
$499255b1b659a685$var$router.route("/").get($c06576b941852e88$export$c6fa6a061f7eb1ac).post($5f54147f8c3b9f85$export$36c6c256c97619fc, $c06576b941852e88$export$c07f11cc9cf44f02);
$499255b1b659a685$var$router.route("/:productId").delete($5f54147f8c3b9f85$export$67a81f8656c72688, $c06576b941852e88$export$e6a4ade4ad9e6e8);
$499255b1b659a685$exports = $499255b1b659a685$var$router;


var $a97473f1a96313b0$exports = {};

/************************************************************************/ // @desc		Get Address for a specific user
// @route 	GET  /api/v1/address
// @access	Private --> (User)
var $0b734f92bafe8f2a$export$4d961ba82f6d99f9;
// @desc		Add Address to user addresses list
// @route 	POST  /api/v1/address
// @access	Private --> (User)
var $0b734f92bafe8f2a$export$f35379b6a68db5cf;
// @desc		Remove address from addresses array
// @route 	DELETE  /api/v1/address/:id
// @access	Private --> (User)
var $0b734f92bafe8f2a$export$a92125bb384e55f1;



$0b734f92bafe8f2a$export$4d961ba82f6d99f9 = $hXvsm$expressasynchandler(async (req, res, next)=>{
    const user = await $ca4b57b91abcd647$exports.findById(req.user._id).populate("address");
    if (!user) return next(new $7c7a5bb37ebf3b57$exports(`No User found with the id:${req.user._id}!\u{1F61E}`, 404));
    res.status(200).json({
        status: "success",
        address: user.address
    });
});
$0b734f92bafe8f2a$export$f35379b6a68db5cf = $hXvsm$expressasynchandler(async (req, res, next)=>{
    const user = await $ca4b57b91abcd647$exports.findByIdAndUpdate(req.user._id, {
        // $addToSet ==> adds address object to addresses array
        $addToSet: {
            address: req.body
        }
    }, {
        new: true,
        runValidators: true
    });
    if (!user) return next(new $7c7a5bb37ebf3b57$exports(`No User found with the id:${req.user._id}!\u{1F61E}`, 404));
    res.status(201).json({
        status: "success",
        message: "Address was successfully added to your Addresses list",
        data: {
            address: user.address.at(-1)
        }
    });
});
$0b734f92bafe8f2a$export$a92125bb384e55f1 = $hXvsm$expressasynchandler(async (req, res, next)=>{
    const user = await $ca4b57b91abcd647$exports.findByIdAndUpdate(req.user._id, {
        // $pull ==> removes address from addresses array
        $pull: {
            Address: req.params.id
        }
    }, {
        new: true
    });
    if (!user) return next(new $7c7a5bb37ebf3b57$exports(`No User found with the id:${req.user._id}!\u{1F61E}`, 404));
    res.status(200).json({
        status: "success",
        message: "Address was successfully removed from your Addresses list.",
        data: {
            address: user.address
        }
    });
});



/**************************************************************************/ //	--- TO DO List ---
// exports.addAddressValidator = [
// 	check('productId')
// 		.isMongoId()
// 		.withMessage('Invalid Object ID format!')
// 		.notEmpty()
// 		.withMessage(
// 			'please provide valid product ID to be added to the wishlist',
// 		)
// 		.custom(async (val) => {
// 			const product = await Product.findById(val);
// 			if (!product) {
// 				throw new AppError(
// 					"Product you're trying to add to the wishlist, doesn't exist!",
// 					404,
// 				);
// 			}
// 			return true;
// 		}),
// 	validatorMiddleware.validationMiddleware,
// ];
var $fede962d8bb3cc04$export$4bd56046801cfc6a;

var $fede962d8bb3cc04$require$check = $hXvsm$expressvalidator.check;



$fede962d8bb3cc04$export$4bd56046801cfc6a = [
    $fede962d8bb3cc04$require$check("id").isMongoId().withMessage("Invalid Object ID format!").notEmpty().withMessage("please provide a valid address ID to be removed from your addresses list").custom(async (val, { req: req })=>{
        const user = await $ca4b57b91abcd647$exports.findById(req.user._id);
        const addressesIds = user.address.map((address)=>address._id.toString());
        if (!addressesIds.includes(val.toString())) throw new $7c7a5bb37ebf3b57$exports("Address you're trying to remove from the Addresses list, doesn't exist!", 404);
        return true;
    }),
    $76b9bbcfebdd77b8$export$fe6394b7002cf45e
];


/*************************************************************************/ const $a97473f1a96313b0$var$router = $hXvsm$express.Router();
// Apply middleware to protect all routes
$a97473f1a96313b0$var$router.use($ce487c6e3030a219$export$eda7ca9e36571553, $ce487c6e3030a219$export$e1bac762c84d3b0c("user"));
$a97473f1a96313b0$var$router.route("/").get($0b734f92bafe8f2a$export$4d961ba82f6d99f9).post(// addressValidator.addToWishlistValidator,
$0b734f92bafe8f2a$export$f35379b6a68db5cf);
$a97473f1a96313b0$var$router.route("/:id").delete($fede962d8bb3cc04$export$4bd56046801cfc6a, $0b734f92bafe8f2a$export$a92125bb384e55f1);
$a97473f1a96313b0$exports = $a97473f1a96313b0$var$router;


var $e4ed9423156283bd$exports = {};

// @desc		Add Product To Cart
// @route 	POST  /api/v1/cart
// @access	Private --> (User)
var $f3c63c5179114997$export$1bdbccb25be1b1c;
// @desc		Get a logged user Cart
// @route 	GET  /api/v1/cart
// @access	Private --> (User)
var $f3c63c5179114997$export$9fbbdfc95b6a13b7;
// @desc		Remove specific Cart item
// @route 	DELETE  /api/v1/cart/:id
// @access	Private --> (User)
var $f3c63c5179114997$export$508c8bcd66647e02;
// @desc		Delete Cart
// @route 	DELETE  /api/v1/cart/
// @access	Private --> (User)
var $f3c63c5179114997$export$810121176e3e3671;
// @desc		Update specific Cart item quantity
// @route 	PATCH  /api/v1/cart/:id
// @access	Private --> (User)
var $f3c63c5179114997$export$f9af3c7866642909;
// @desc		Apply Coupon on logged user Cart
// @route 	POST  /api/v1/cart/applyCoupon
// @access	Private --> (User)
var $f3c63c5179114997$export$e7bd5839d7a61f49;

var $49fb43efabdb8e82$exports = {};

const { Schema: $49fb43efabdb8e82$var$Schema } = $hXvsm$mongoose;
//1- Create Schema
const $49fb43efabdb8e82$var$cartSchema = new $49fb43efabdb8e82$var$Schema({
    cartItems: [
        {
            product: {
                type: $49fb43efabdb8e82$var$Schema.ObjectId,
                ref: "Product"
            },
            quantity: {
                type: Number,
                default: 1
            },
            price: {
                type: Number,
                required: true
            },
            color: {
                type: String,
                lowercase: true
            }
        }
    ],
    totalPrice: {
        type: Number
    },
    totalPriceAfterDiscount: {
        type: Number
    },
    user: {
        type: $49fb43efabdb8e82$var$Schema.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    }
});
//------------------------------------------------------------------------
//2- Create Model
$49fb43efabdb8e82$exports = $hXvsm$mongoose.model("Cart", $49fb43efabdb8e82$var$cartSchema);





/**********************************************************************************/ const $f3c63c5179114997$var$calcCartTotalPrice = (cart)=>{
    //calculate TotalPrice of Cart
    const totalPrice = cart.cartItems.reduce((acc, curr)=>acc + curr.quantity * curr.price, 0);
    cart.totalPrice = totalPrice;
    cart.totalPriceAfterDiscount = undefined;
};
$f3c63c5179114997$export$1bdbccb25be1b1c = $hXvsm$expressasynchandler(async (req, res, next)=>{
    // -Get product details to be used
    const product = await $5b845a0164a902e5$exports.findById(req.body.product);
    // 1) Get Cart for logged user
    let cart = await $49fb43efabdb8e82$exports.findOne({
        user: req.user._id
    });
    if (!cart) // 2) No Cart? ---> Create a new Cart for logged user with product
    cart = await $49fb43efabdb8e82$exports.create({
        user: req.user._id,
        cartItems: [
            {
                product: req.body.product,
                quantity: req.body.quantity || 1,
                color: req.body.color,
                price: product.price
            }
        ]
    });
    else {
        // 3) Cart already exists? ---> get product ids in stock
        const existingProductIndex = cart.cartItems.findIndex((item)=>item.product.toString() === req.body.product && item.color === req.body.color.toLowerCase());
        // A) Product is already in stock? --> update product's quantity
        if (existingProductIndex > -1) cart.cartItems[existingProductIndex].quantity += req.body.quantity;
        else cart.cartItems.push({
            product: req.body.product,
            quantity: req.body.quantity || 1,
            color: req.body.color,
            price: product.price
        });
    }
    //calculate TotalPrice of Cart
    $f3c63c5179114997$var$calcCartTotalPrice(cart);
    await cart.save();
    res.status(200).json({
        status: "success",
        message: "Product added to cart successfully! \uD83E\uDD17",
        cartItems: cart.cartItems.length,
        data: cart
    });
});
$f3c63c5179114997$export$9fbbdfc95b6a13b7 = $hXvsm$expressasynchandler(async (req, res, next)=>{
    const cart = await $49fb43efabdb8e82$exports.findOne({
        user: req.user._id
    });
    if (!cart) return next(new $7c7a5bb37ebf3b57$exports(`${req.user.name.split(" ")[0]} Does not have any items in his cart!`, 404));
    if (cart.user.toString() !== req.user._id.toString()) return next(new $7c7a5bb37ebf3b57$exports(`You are not authorized to access this cart. Only the user who created this cart can perform this action!`, 403));
    if (cart.cartItems.length === 0) return next(new $7c7a5bb37ebf3b57$exports(`Your cart is empty!`, 403));
    res.status(200).json({
        status: "success",
        cartItems: cart.cartItems.length,
        data: cart
    });
});
$f3c63c5179114997$export$508c8bcd66647e02 = $hXvsm$expressasynchandler(async (req, res, next)=>{
    const cart = await $49fb43efabdb8e82$exports.findOneAndUpdate({
        user: req.user._id
    }, {
        $pull: {
            cartItems: {
                _id: req.params.id
            }
        }
    }, {
        new: true
    });
    if (!cart) return next(new $7c7a5bb37ebf3b57$exports(`${req.user.name.split(" ")[0]} Does not have any items in his cart!`, 404));
    //calculate TotalPrice of Cart
    $f3c63c5179114997$var$calcCartTotalPrice(cart);
    await cart.save();
    res.status(200).json({
        status: "success",
        cartItems: cart.cartItems.length,
        data: cart
    });
});
$f3c63c5179114997$export$810121176e3e3671 = $hXvsm$expressasynchandler(async (req, res, next)=>{
    const cart = await $49fb43efabdb8e82$exports.findOneAndDelete({
        user: req.user._id
    });
    if (!cart) return next(new $7c7a5bb37ebf3b57$exports(`${req.user.name.split(" ")[0]} Does not have any items in his cart!`, 404));
    res.status(204).send();
});
$f3c63c5179114997$export$f9af3c7866642909 = $hXvsm$expressasynchandler(async (req, res, next)=>{
    // 1) Find Cart
    const cart = await $49fb43efabdb8e82$exports.findOne({
        user: req.user._id
    });
    if (!cart) return next(new $7c7a5bb37ebf3b57$exports(`${req.user.name.split(" ")[0]} Does not have any items in his cart!`, 404));
    if (cart.cartItems.length === 0) return next(new $7c7a5bb37ebf3b57$exports(`Your cart is empty!`, 403));
    // 2) Cart already exists? ---> get cart Id
    const CartItemIdx = cart.cartItems.findIndex((item)=>item._id.toString() === req.params.id);
    if (CartItemIdx === -1) return next(new $7c7a5bb37ebf3b57$exports(`There's no cartItem with the id: ${req.params.id}`, 404));
    // 3) Update cartItem quantity
    cart.cartItems[CartItemIdx].quantity = req.body.quantity;
    // 4) calculate TotalPrice of remaining CartItems and save
    $f3c63c5179114997$var$calcCartTotalPrice(cart);
    await cart.save();
    res.status(200).json({
        status: "success",
        cartItems: cart.cartItems.length,
        data: cart
    });
});
$f3c63c5179114997$export$e7bd5839d7a61f49 = $hXvsm$expressasynchandler(async (req, res, next)=>{
    // 1) Get and check the validity of the coupon
    const coupon = await $9cba5631b8a35fe5$exports.findOne({
        name: req.body.name,
        expires: {
            $gt: Date.now()
        }
    });
    if (!coupon) return next(new $7c7a5bb37ebf3b57$exports(`${req.body.name} is not a valid Coupon or expired!!`, 404));
    // 2) Get logged user cart to get its totalPrice
    const cart = await $49fb43efabdb8e82$exports.findOne({
        user: req.user._id
    });
    if (!cart) return next(new $7c7a5bb37ebf3b57$exports(`${req.user.name.split(" ")[0]}, You don't have any purchased items in your cart to apply coupon on!`, 404));
    if (cart.cartItems.length === 0) return next(new $7c7a5bb37ebf3b57$exports(`Your cart is empty!`, 403));
    const { totalPrice: totalPrice } = cart;
    // 3) Apply the coupon to the total price
    const discount = (totalPrice * (coupon.discount / 100)).toFixed(2);
    // 4) Update the cart's totalPrice after applying coupon
    cart.totalPriceAfterDiscount = totalPrice - discount;
    // 5) Save the updated cart
    await cart.save();
    res.status(200).json({
        status: "success",
        cartItems: cart.cartItems.length,
        data: cart
    });
});



/*************************************************************************/ const $e4ed9423156283bd$var$router = $hXvsm$express.Router();
$e4ed9423156283bd$var$router.use($ce487c6e3030a219$export$eda7ca9e36571553, $ce487c6e3030a219$export$e1bac762c84d3b0c("user"));
$e4ed9423156283bd$var$router.route("/").get($f3c63c5179114997$export$9fbbdfc95b6a13b7).post($f3c63c5179114997$export$1bdbccb25be1b1c).delete($f3c63c5179114997$export$810121176e3e3671);
$e4ed9423156283bd$var$router.patch("/applyCoupon", $f3c63c5179114997$export$e7bd5839d7a61f49);
$e4ed9423156283bd$var$router.route("/:id").patch($f3c63c5179114997$export$f9af3c7866642909).delete($f3c63c5179114997$export$508c8bcd66647e02);
$e4ed9423156283bd$exports = $e4ed9423156283bd$var$router;


var $32c6c36b5c22234a$exports = {};

/* eslint-disable no-console */ /* eslint-disable import/no-extraneous-dependencies */ /**********************************************************************************/ //HELPER FUNCTIONS
var $8d247d0a428203b9$export$c79bd3be85f753a0;
/**********************************************************************************/ // @desc		Get All Orders
// @route 	GET  /api/v1/orders
// @access	Private --> (User, Admin)
var $8d247d0a428203b9$export$32d5b9ffee639b2a;
// @desc		Get a Specific Order
// @route 	GET  /api/v1/orders/:id
// @access	Public
var $8d247d0a428203b9$export$4e05eed7f498666c;
// @desc		Create cod(cash on delivery) Order
// @route 	POST  /api/v1/orders/cartId
// @access	Private --> (User)
var $8d247d0a428203b9$export$cfd4a9a1643254bd;
// @desc		Update order payment status to paid
// @route 	PATCH  /api/v1/orders/:id/pay
// @access	Private --> (Admin - Manager)
var $8d247d0a428203b9$export$91cb9fb1c1d8af72;
// @desc		Update order delivery status to delivered
// @route 	PATCH  /api/v1/orders/:id/deliver
// @access	Private --> (Admin - Manager)
var $8d247d0a428203b9$export$66635d9d3025feee;
// @desc		Get Checkout Session from Stripe and send it as a response
// @route 	GET  /api/v1/orders/checkout-session/:cartIds
// @access	Private --> (User)
var $8d247d0a428203b9$export$f1c4cda49673848c;
// @desc		create Checkout Webhook from Stripe
// @route 	POST  /webhook-checkout
// @access	Private --> (User)
var $8d247d0a428203b9$export$a93ec902df19e733;

const $8d247d0a428203b9$var$stripe = $hXvsm$stripe(undefined);


var $fd951ce66f6de7cd$exports = {};

const { Schema: $fd951ce66f6de7cd$var$Schema } = $hXvsm$mongoose;
//1- Create Schema
const $fd951ce66f6de7cd$var$orderSchema = new $fd951ce66f6de7cd$var$Schema({
    user: {
        type: $fd951ce66f6de7cd$var$Schema.ObjectId,
        ref: "User",
        required: [
            true,
            "Order must belong to a specific user"
        ]
    },
    cartItems: [
        {
            product: {
                type: $fd951ce66f6de7cd$var$Schema.ObjectId,
                ref: "Product"
            },
            quantity: Number,
            price: Number,
            color: String
        }
    ],
    taxPrice: {
        type: Number,
        default: 0
    },
    shippingPrice: {
        type: Number,
        default: 30
    },
    orderTotalPrice: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: [
            "paypal",
            "card",
            "cod"
        ],
        default: "cod"
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paidAt: Date,
    shippingAddress: {
        details: String,
        postalCode: String,
        phone: String,
        city: String
    },
    isDelivered: {
        type: Boolean,
        default: false
    },
    deliveredAt: Date
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    }
});
//------------------------------------------------------------------------
//Middlewares
$fd951ce66f6de7cd$var$orderSchema.pre(/^find/, function(next) {
    this.populate([
        {
            path: "user",
            select: "name email profilePicture"
        },
        {
            path: "cartItems.product",
            select: "title ratingsAverage"
        }
    ]);
    next();
});
//------------------------------------------------------------------------
//2- Create Model
$fd951ce66f6de7cd$exports = $hXvsm$mongoose.model("Order", $fd951ce66f6de7cd$var$orderSchema);





$8d247d0a428203b9$export$c79bd3be85f753a0 = $hXvsm$expressasynchandler(async (req, res, next)=>{
    if (req.user.role === "user") req.filterObj = {
        user: req.user._id
    };
    next();
});
$8d247d0a428203b9$export$32d5b9ffee639b2a = $227fa3de72c027a5$export$2774c37398bee8b2($fd951ce66f6de7cd$exports);
$8d247d0a428203b9$export$4e05eed7f498666c = $227fa3de72c027a5$export$2eb5ba9a66e42816($fd951ce66f6de7cd$exports);
$8d247d0a428203b9$export$cfd4a9a1643254bd = $hXvsm$expressasynchandler(async (req, res, next)=>{
    // @App Settings
    const taxPrice = 0;
    const shippingPrice = 0;
    // 1) Get Cart with cartId and validate it belongs to logged user
    const cart = await $49fb43efabdb8e82$exports.findById(req.params.cartId);
    if (!cart) return next(new $7c7a5bb37ebf3b57$exports(`${req.user.name.split(" ")[0]}, Either your cart does not exist, or you have no purchased items in it.`, 404));
    if (cart.user.toString() !== req.user._id.toString()) return next(new $7c7a5bb37ebf3b57$exports(`You are not authorized to access this cart. Only the user who created this cart can perform this action!`, 403));
    if (cart.cartItems.length === 0) return next(new $7c7a5bb37ebf3b57$exports(`Your cart is empty!`, 403));
    // 2) Get Order price depending on cart price "Check if coupon applied"
    // @@ Ternary Operator considers '0' as a valid value while || considers '0' as a falsy value@@
    const cartPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalPrice;
    const orderTotalPrice = cartPrice + taxPrice + shippingPrice;
    // const address = req.user._id &&&&&&&&&&&&&&&&&&&&&&&&&&&&
    // 3) Create order with default payment method (COD)
    const order = await $fd951ce66f6de7cd$exports.create({
        user: req.user._id,
        cartItems: cart.cartItems,
        // shippingAddress: req.user._id.address, &&&&&&&&&&&&&&&&&&&&&&&&&&&&
        shippingAddress: req.body.shippingAddress,
        orderTotalPrice: orderTotalPrice
    });
    //--------------------------------------------------------------------
    //4) After Creating Order, decrement product quantity and increment product sold
    //--1st--//	 const products = cart.cartItems.map((item) => {
    //--1st--//	 	const { product } = item;
    //--1st--//	 	const { quantity } = item;
    //--1st--//	 	return { product, quantity };
    //--1st--//	 });
    //--1st--//	 await Product.updateMany(
    //--1st--//	 	{ _id: { $in: products.product } },
    //--1st--//	 	{ $inc: { quantity: -products.quantity, sold: +products.quantity } },
    //--1st--//	 );
    /*--2nd--*/ /*--2nd--*/ /*--2nd--*/ /*--2nd--*/ /*--2nd--*/ /*--2nd--*/ /*--2nd--*/ if (order) {
        const bulkOptions = cart.cartItems.map((item)=>({
                updateOne: {
                    filter: {
                        _id: item.product
                    },
                    update: {
                        $inc: {
                            quantity: -item.quantity,
                            sold: +item.quantity
                        }
                    },
                    upsert: true
                }
            }));
        await $5b845a0164a902e5$exports.bulkWrite(bulkOptions, {});
        // await Order.save();
        //--------------------------------------------------------------------
        //5) clear user cart depending on cartId
        await $49fb43efabdb8e82$exports.findByIdAndDelete(req.params.cartId);
    }
    //6) send response
    res.status(201).json({
        status: "success",
        message: "Order is created successfully! \uD83E\uDD17",
        data: order
    });
});
$8d247d0a428203b9$export$91cb9fb1c1d8af72 = $hXvsm$expressasynchandler(async (req, res, next)=>{
    const order = await $fd951ce66f6de7cd$exports.findById(req.params.id);
    if (!order) return next(new $7c7a5bb37ebf3b57$exports(`No Order found with the id:${req.params.id}!\u{1F61E}\u{1F61E}`, 404));
    if (order.isPaid) return next(new $7c7a5bb37ebf3b57$exports(`Order you're trying to update is already paid`, 404));
    //update order paid status to paid
    order.isPaid = true;
    order.paidAt = Date.now();
    const updatedOrder = await order.save();
    res.status(200).json({
        status: "success",
        message: "Order updated successfully!",
        data: {
            order: updatedOrder
        }
    });
});
$8d247d0a428203b9$export$66635d9d3025feee = $hXvsm$expressasynchandler(async (req, res, next)=>{
    const order = await $fd951ce66f6de7cd$exports.findById(req.params.id);
    if (!order) return next(new $7c7a5bb37ebf3b57$exports(`No Order found with the id:${req.params.id}!\u{1F61E}\u{1F61E}`, 404));
    if (order.isDelivered) return next(new $7c7a5bb37ebf3b57$exports(`Order you're trying to update is already Delivered`, 404));
    //update order delivery status to delivered
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.status(200).json({
        status: "success",
        message: "Order updated successfully!",
        data: {
            order: updatedOrder
        }
    });
});
$8d247d0a428203b9$export$f1c4cda49673848c = $hXvsm$expressasynchandler(async (req, res, next)=>{
    // @App Settings
    const taxPrice = 0;
    const shippingPrice = 0;
    // 1) Get Cart with cartId and validate it belongs to logged user
    const cart = await $49fb43efabdb8e82$exports.findById(req.params.cartId);
    if (!cart) return next(new $7c7a5bb37ebf3b57$exports(`${req.user.name.split(" ")[0]}, Either your cart does not exist, or you have no purchased items in it.`, 404));
    if (cart.user.toString() !== req.user._id.toString()) return next(new $7c7a5bb37ebf3b57$exports(`You are not authorized to access this cart. Only the user who created this cart can perform this action!`, 403));
    if (cart.cartItems.length === 0) return next(new $7c7a5bb37ebf3b57$exports(`Your cart is empty!`, 403));
    // 2) Get Order Price depend i=on cart price "check if coupon applied"
    const cartPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalPrice;
    const orderTotalPrice = cartPrice + taxPrice + shippingPrice;
    // 3) Create Stripe Checkout session
    const session = await $8d247d0a428203b9$var$stripe.checkout.sessions.create({
        expand: [
            "line_items"
        ],
        mode: "payment",
        success_url: `${req.protocol}://${req.get("host")}/orders`,
        cancel_url: `${req.protocol}://${req.get("host")}/cart`,
        customer_email: req.user.email,
        // customer_address: req.body.shippingAddress,
        client_reference_id: req.params.cartId,
        metadata: {
            address: req.body.shippingAddress
        },
        // shipping_address_collection: req.body.shippingAddress,
        line_items: [
            {
                price_data: {
                    unit_amount: orderTotalPrice * 100,
                    currency: "egp",
                    product_data: {
                        name: `${req.user.name}'s Order`,
                        description: `${req.body.shippingAddress}` || "address"
                    }
                },
                quantity: 1
            }
        ]
    });
    // 4) Send Session to Response
    res.status(200).json({
        status: "success",
        message: "Checkout Session created successfully!",
        data: {
            session: session
        }
    });
});
$8d247d0a428203b9$export$a93ec902df19e733 = $hXvsm$expressasynchandler(async (req, res, next)=>{
    const sig = req.headers["stripe-signature"];
    let event;
    try {
        event = $8d247d0a428203b9$var$stripe.webhooks.constructEvent(req.body, sig, undefined);
        if (event.type === "checkout.session.completed") {
            console.log("Create Order Here!");
            console.log(event.data.object.client_reference_id);
        }
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
});



/*************************************************************************/ const $32c6c36b5c22234a$var$router = $hXvsm$express.Router();
$32c6c36b5c22234a$var$router.use($ce487c6e3030a219$export$eda7ca9e36571553);
$32c6c36b5c22234a$var$router.get("/checkout-session/:cartId", $ce487c6e3030a219$export$e1bac762c84d3b0c("user"), $8d247d0a428203b9$export$f1c4cda49673848c);
$32c6c36b5c22234a$var$router.route("/:cartId").post($ce487c6e3030a219$export$e1bac762c84d3b0c("user"), $8d247d0a428203b9$export$cfd4a9a1643254bd);
// .get(orderController.getLoggedUserCart)
// .delete(orderController.clearCart);
$32c6c36b5c22234a$var$router.route("/").get($ce487c6e3030a219$export$e1bac762c84d3b0c("user", "admin", "manager"), $8d247d0a428203b9$export$c79bd3be85f753a0, $8d247d0a428203b9$export$32d5b9ffee639b2a);
$32c6c36b5c22234a$var$router.route("/:id").get($8d247d0a428203b9$export$4e05eed7f498666c);
$32c6c36b5c22234a$var$router.route("/:id/pay").patch($ce487c6e3030a219$export$e1bac762c84d3b0c("admin", "manager"), $8d247d0a428203b9$export$91cb9fb1c1d8af72);
$32c6c36b5c22234a$var$router.route("/:id/deliver").patch($ce487c6e3030a219$export$e1bac762c84d3b0c("admin", "manager"), $8d247d0a428203b9$export$66635d9d3025feee);
$32c6c36b5c22234a$exports = $32c6c36b5c22234a$var$router;


/***************************************************************/ // Mounting routes to the main application
const $df4918d75e68c40b$var$mountRoutes = (app)=>{
    app.use("/api/v1/auth", $90c3243559758cae$exports);
    app.use("/api/v1/users", $6495ec4508b63af1$exports);
    app.use("/api/v1/categories", $f532c635ed3b398d$exports);
    app.use("/api/v1/subCategories", $68dee80ddacd12e4$exports);
    app.use("/api/v1/brands", $ddfe60ef2f51e535$exports);
    app.use("/api/v1/products", $0cbb63b28ec796ac$exports);
    app.use("/api/v1/coupons", $b4959900d73918b4$exports);
    app.use("/api/v1/reviews", $b14a6d4adc0e87b7$exports);
    app.use("/api/v1/wishlist", $499255b1b659a685$exports);
    app.use("/api/v1/address", $a97473f1a96313b0$exports);
    app.use("/api/v1/cart", $e4ed9423156283bd$exports);
    app.use("/api/v1/orders", $32c6c36b5c22234a$exports);
};
$df4918d75e68c40b$exports = $df4918d75e68c40b$var$mountRoutes;




var $b2fe290a65fb278a$exports = {};

const $b2fe290a65fb278a$var$handleJWTError = ()=>new $7c7a5bb37ebf3b57$exports("Invalid Token, Please login again!", 401);
const $b2fe290a65fb278a$var$handleExpiredJWTError = ()=>new $7c7a5bb37ebf3b57$exports("Expired Token, Please login again!", 401);
const $b2fe290a65fb278a$var$sendErrorDev = (err, req, res)=>{
    res.status(+err.statusCode).json({
        status: err.status,
        name: err.name,
        message: err.message,
        error: err,
        stack: err.stack
    });
};
const $b2fe290a65fb278a$var$sendErrorProd = (err, req, res)=>{
    if (err.name === "JsonWebTokenError") err = $b2fe290a65fb278a$var$handleJWTError();
    if (err.name === "TokenExpiredError") err = $b2fe290a65fb278a$var$handleExpiredJWTError();
    res.status(+err.statusCode).json({
        status: err.status,
        message: err.message
    });
};
//Global Error Handling Middleware for Express
$b2fe290a65fb278a$exports = (err, req, res, next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = `${err.status}` || "Error";
    $b2fe290a65fb278a$var$sendErrorDev(err, req, res);
    next();
};


/****************************************************************************/ $hXvsm$dotenv.config({
    path: "config.env"
});
//connect with DB
$62946481e995a120$exports();
//Express App
const $2685e5b20c9f29f6$var$app = $hXvsm$express();
// Enable CORS (Cross-Origin Resource Sharing) to allow requests from other domains
$2685e5b20c9f29f6$var$app.use($hXvsm$cors());
$2685e5b20c9f29f6$var$app.options("*", $hXvsm$cors());
//compressing all texts send to clients
$2685e5b20c9f29f6$var$app.use($hXvsm$compression());
$2685e5b20c9f29f6$var$app.post("/webhook-checkout", $hXvsm$express.raw({
    type: "application/json"
}), $8d247d0a428203b9$export$a93ec902df19e733);
// Middlewares
$2685e5b20c9f29f6$var$app.use($hXvsm$express.json()); //parser that turns the encoded string to a js object to be readable
$2685e5b20c9f29f6$var$app.use($hXvsm$express.static($hXvsm$path.join($2685e5b20c9f29f6$var$__dirname, "public")));
$2685e5b20c9f29f6$var$app.use($hXvsm$morgan("dev"));
console.log(`mode: ${"development"}`);
/****************************************************************/ //3) Routes
//Mounting our app Routes
$df4918d75e68c40b$exports($2685e5b20c9f29f6$var$app);
$2685e5b20c9f29f6$var$app.get("/", (req, res)=>{
    res.status(200).send({
        status: "success",
        message: "Welcome to my API! \uD83D\uDE0A"
    });
});
$2685e5b20c9f29f6$var$app.all("*", (req, res, next)=>{
    //Create Error snd send it to error handling middleware...
    next(new $7c7a5bb37ebf3b57$exports(`Can't find ${req.originalUrl} on this server!`, 404));
});
/*************************************************************************/ //Global Error Handling Middleware for Express
$2685e5b20c9f29f6$var$app.use($b2fe290a65fb278a$exports);
const $2685e5b20c9f29f6$var$PORT = 3000;
const $2685e5b20c9f29f6$var$server = $2685e5b20c9f29f6$var$app.listen($2685e5b20c9f29f6$var$PORT, ()=>{
    console.log(`App running on port ${$2685e5b20c9f29f6$var$PORT}!\u{1F601}`);
});
//Handling Rejections outside Express
$hXvsm$process.on("unhandledRejection", (err)=>{
    console.error(`UNHANDLED REJECTION!\u{1F4A5}\u{1F4A5}\u{1F4A5}`);
    console.error(`${err.name.toUpperCase()}: ${err.message}\u{26A0}\u{FE0F}\u{26A0}\u{FE0F}`);
    // Close server & exit process
    $2685e5b20c9f29f6$var$server.close(()=>{
        $hXvsm$process.exit(1);
    });
});


//# sourceMappingURL=index.js.map
