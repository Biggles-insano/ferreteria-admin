"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const auth_1 = require("../utils/auth");
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado: Token no proporcionado' });
    }
    const user = (0, auth_1.verifyToken)(token);
    if (!user) {
        return res.status(403).json({ error: 'Acceso denegado: Token inválido o expirado' });
    }
    req.user = user;
    next();
};
exports.authenticateToken = authenticateToken;
