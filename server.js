const express = require("express");
const { REST, Routes, SlashCommandBuilder } = require("discord.js");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`
  <html>
  <head>
    <title>Slash Panel</title>
    <style>
      body {
        background:#0f172a;
        color:white;
        font-family:sans-serif;
        display:flex;
        justify-content:center;
        align-items:center;
        height:100vh;
      }
      .card {
        background:#1e293b;
        padding:30px;
        border-radius:12px;
        width:400px;
      }
      input {
        width:100%;
        padding:10px;
        margin:5px 0;
        border-radius:6px;
        border:none;
      }
      button {
        width:100%;
        padding:10px;
        margin-top:10px;
        background:#5865F2;
        border:none;
        color:white;
        border-radius:6px;
        cursor:pointer;
      }
      button:hover {
        background:#4752C4;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h2>Painel Slash Commands</h2>
      <input id="token" placeholder="Token do Bot">
      <input id="clientId" placeholder="Client ID">
      <input id="guildId" placeholder="Guild ID">
      <button onclick="register()">Registrar Comandos</button>
      <p id="msg"></p>
    </div>

    <script>
      async function register() {
        const token = document.getElementById("token").value;
        const clientId = document.getElementById("clientId").value;
        const guildId = document.getElementById("guildId").value;

        const res = await fetch("/register", {
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({token,clientId,guildId})
        });

        const data = await res.json();
        document.getElementById("msg").innerText = data.message;
      }
    </script>
  </body>
  </html>
  `);
});

app.post("/register", async (req, res) => {
  const { token, clientId, guildId } = req.body;

  try {
    const commands = [
      new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Responde Pong"),

      new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("Mostra avatar"),

      new SlashCommandBuilder()
        .setName("say")
        .setDescription("Faz o bot falar")
        .addStringOption(opt =>
          opt.setName("mensagem")
            .setDescription("Mensagem")
            .setRequired(true)
        )
    ].map(cmd => cmd.toJSON());

    const rest = new REST({ version:"10" }).setToken(token);

    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );

    res.json({ message:"Comandos registrados com sucesso!" });

  } catch (err) {
    res.json({ message:"Erro ao registrar. Verifique dados." });
  }
});

app.listen(3000, () => console.log("Rodando na porta 3000"));
