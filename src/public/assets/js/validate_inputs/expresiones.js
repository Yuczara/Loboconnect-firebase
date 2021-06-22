const expresiones = {
    username: /^[a-zA-ZÀ-ÿ\s]{4,25}$/, // Letras
    departamento: /^[a-zA-ZÀ-ÿ0-9\s\_\-]{4,35}$/, // Letras, numeros, guion y guion_bajo
    password: /^.{4,12}$/, // 4 a 12 digitos.
    email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    titulo: /^[a-zA-ZÀ-ÿ0-9\s\-]{4,20}$/,
    descripcion: /^[a-zA-ZÀ-ÿ0-9\s\-\/\.\,]{4,500}$/,
}