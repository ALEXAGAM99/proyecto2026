async function obtenerIPPublica(): Promise<string> {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip as string;
  } catch {
    return "";
  }
}


export async function LoginUsuario(usuario: string, password: string) {
  try {
    const ipPublica = await obtenerIPPublica();

    const loginRes = await fetch("http://localhost:3005/api/medicos/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mat: usuario,
        contra: password,
        ipCliente: ipPublica,
        navegador: navigator.userAgent,
      }),
    });
    const loginData = await loginRes.json();

    if (loginData.success && loginData.user) {
      return {
        success: true,
        user: loginData.user,
        sesionId: loginData.session_id ?? Date.now(),
      };
    }

    return {
      success: false,
      message: loginData.message || "Matrícula o contraseña incorrectos",
    };
  } catch (error) {
    console.error("Error en login:", error);
    return { success: false, message: "Error de conexión con el servidor" };
  }
}


export async function LogoutUsuario(sesionId: string | number) {
  try {
    await fetch("http://localhost:3005/api/auditoria/salida", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sesionId }),
    });
  } catch (error) {
    console.error("Error en logout:", error);
  }
}
