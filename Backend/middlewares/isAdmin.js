export const isAdmin = (req, res, next) => {
    try {
        if (!req.user || !req.user.isAdmin) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        next();
    } catch (error) {
        console.error('Error authorizing user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


