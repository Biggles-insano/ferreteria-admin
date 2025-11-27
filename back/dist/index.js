"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const port = process.env.PORT || 3000;
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const catalogRoutes_1 = __importDefault(require("./routes/catalogRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const inventoryRoutes_1 = __importDefault(require("./routes/inventoryRoutes"));
const partnerRoutes_1 = __importDefault(require("./routes/partnerRoutes"));
const salesRoutes_1 = __importDefault(require("./routes/salesRoutes"));
const purchaseRoutes_1 = __importDefault(require("./routes/purchaseRoutes"));
const financeRoutes_1 = __importDefault(require("./routes/financeRoutes"));
const authMiddleware_1 = require("./middlewares/authMiddleware");
const errorHandler_1 = require("./middlewares/errorHandler");
const requestLogger_1 = require("./middlewares/requestLogger");
app.use((0, helmet_1.default)()); // Security Headers
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Logging
app.use(requestLogger_1.consoleLogger);
app.use(requestLogger_1.requestLogger);
app.use('/api/auth', authRoutes_1.default);
// Protected Routes
// Protected Routes
app.use('/api/catalogos', catalogRoutes_1.default);
app.use('/api/productos', productRoutes_1.default);
app.use('/api/inventario', inventoryRoutes_1.default);
app.use('/api/terceros', partnerRoutes_1.default);
app.use('/api/ventas', salesRoutes_1.default);
app.use('/api/compras', purchaseRoutes_1.default);
app.use('/api/finanzas', financeRoutes_1.default);
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});
// Example endpoint to verify DB connection
app.get('/api/sucursales', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sucursales = yield prisma.sucursal.findMany();
        res.json(sucursales);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
app.use(errorHandler_1.errorHandler);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
