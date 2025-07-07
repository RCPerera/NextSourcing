import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        required: [true, 'Employee ID is required'],
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        trim: true
    },
    position: {
        type: String,
        required: [true, 'Position is required'],
        trim: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    date: {
        type: Date,
        required: [true, 'Date is required'],
        default: Date.now
    },
    attendTime: {
        type: String,
        required: [true, 'Attend time is required']
    },
    leaveTime: {
        type: String,
        required: [true, 'Leave time is required']
    },
    salary: {
        basic: {
            type: Number,
            default: 0
        },
        allowances: {
            type: Number,
            default: 0
        },
        deductions: {
            type: Number,
            default: 0
        },
        netSalary: {
            type: Number,
            default: 0
        },
        lastUpdated: {
            type: Date
        },
        history: [{
            basic: Number,
            allowances: Number,
            deductions: Number,
            netSalary: Number,
            date: {
                type: Date,
                default: Date.now
            },
            note: String
        }]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;