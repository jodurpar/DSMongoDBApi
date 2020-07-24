
export type ConnectionString = {
    name: string,
    url: string,
    type : string
} 

export type AuthClient = {
    client: string;
    secretKey: string;
}

export type AuthClients = {
    AuthorizationClients: AuthClient[],
    ConnectionStrings : ConnectionString[]
}

