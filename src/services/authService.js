export const API_URL =
  "/api";

function generateKey() {

  return crypto.randomUUID();
}

/* LOGIN */
export async function loginRequest(
  data
) {

  const response =
    await fetch(

      `${API_URL}/login`,

      {

        method: "POST",

        headers: {

          "Content-Type":
            "application/json",

          "x-idempotency-key":
            generateKey()
        },

        body: JSON.stringify(
          data
        )
      }
    );

  if (!response.ok) {

    throw new Error(
      "Email ou senha inválidos"
    );
  }

  return response.json();
}

/* CADASTRO */
export async function registerRequest(
  data
) {

  const response =
    await fetch(

      `${API_URL}/user`,

      {

        method: "POST",

        headers: {

          "Content-Type":
            "application/json",

          "x-idempotency-key":
            generateKey()
        },

        body: JSON.stringify(
          data
        )
      }
    );

  if (!response.ok) {

    throw new Error(
      "Erro ao cadastrar"
    );
  }

  return response.json();
}

export async function verifyEmailRequest(token) {
  const response = await fetch(`${API_URL}/user/email/verify?token=${token}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Link de verificação inválido ou expirado.");
  }

  return response.json();
}

/* EXCLUIR CONTA */
export async function deleteAccountRequest(
  userId,
  token
) {

  const response =
    await fetch(

      `${API_URL}/user/${userId}`,

      {

        method: "DELETE",

        headers: {

          Authorization:
            `Bearer ${token}`
        }
      }
    );

  if (!response.ok) {

    throw new Error(
      "Erro ao excluir conta"
    );
  }

  return response.json();
}

export async function updateUserRequest(
  userId,
  payload,
  token
) {

  const response =
    await fetch(

      `${API_URL}/user/${userId}`,

      {

        method: "PUT",

        headers: {

          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`,

          "x-idempotency-key":
            crypto.randomUUID()
        },

        body:
          JSON.stringify(
            payload
          )
      }
    );

  if (!response.ok) {

    const errorText =
      await response.text();

    console.log(
      "ERRO BACKEND:",
      errorText
    );

    throw new Error(
      errorText
    );
  }

  return response.json();
}

export async function getUserById(
  userId,
  token
) {

  const response =
    await fetch(

      `${API_URL}/user/${userId}`,

      {

        method: "GET",

        headers: {

          Authorization:
            `Bearer ${token}`
        }
      }
    );

  if (!response.ok) {

    throw new Error(
      "Erro ao buscar usuário"
    );
  }

  return response.json();
}

/* ESQUECEU A SENHA - SOLICITAR E-MAIL */
export async function forgotPasswordRequest(mail) {
  const response = await fetch(`${API_URL}/user/password/forgot?mail=${encodeURIComponent(mail)}`, {
    method: "POST",
  });
  if (!response.ok) throw new Error("Erro ao solicitar redefinição de senha");
  return response.text(); // Pode retornar uma mensagem de sucesso
}

/* REDEFINIR SENHA */
export async function resetPasswordRequest(token, newPassword) {
  const response = await fetch(`${API_URL}/user/password/reset?token=${token}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: newPassword }),
  });
  if (!response.ok) throw new Error("Erro ao redefinir senha");
  return response.json();
}