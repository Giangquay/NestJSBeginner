enum Order{
    ASC="ASC",
    DESC='DESC'
}

enum Role {
    User = 'User',
    Admin = 'Admin',
}

enum Permission {
    Manage = 'manage',
    Create = 'create',
    Read = 'read',
    Update = 'update',
    Delete = 'delete',
}


export {
    Order,Role,Permission
}