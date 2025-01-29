const { Client, GatewayIntentBits, Partials, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel],
});

const semesterRoles = {
  1: '1333841926100877434',
  2: '1333842872599969965',
  3: '1333842927822045255',
  4: '1333842969543053363',
  5: '1333843010907275387',
  6: '1333843063428350084',
  7: '1333843107019620465',
  8: '1333843152225701998',
};

client.once('ready', () => {
  console.log(`Bot está online como ${client.user.tag}`);
});

client.on('guildMemberAdd', async (member) => {
  try {
    const tempChannel = await member.guild.channels.create({
      name: `escolha-${member.user.username}`,
      type: 0,
      permissionOverwrites: [
        {
          id: member.guild.id,
          deny: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: member.user.id,
          allow: [PermissionFlagsBits.ViewChannel],
        },
      ],
    });

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('course_cs')
        .setLabel('Ciência da Computação')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('course_other')
        .setLabel('Outro Curso')
        .setStyle(ButtonStyle.Danger)
    );

    await tempChannel.send({
      content: `Bem-vindo ao servidor, ${member.user}! Escolha seu curso clicando em um dos botões abaixo:`,
      components: [buttons],
    });

    console.log(`Sala privada criada para ${member.user.tag}`);
  } catch (error) {
    console.error(`Erro ao criar sala privada: ${error}`);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === 'course_cs') {
    const semesterButtonsRow1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('semester_1').setLabel('1º Semestre').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('semester_2').setLabel('2º Semestre').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('semester_3').setLabel('3º Semestre').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('semester_4').setLabel('4º Semestre').setStyle(ButtonStyle.Primary)
    );
  
    const semesterButtonsRow2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('semester_5').setLabel('5º Semestre').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('semester_6').setLabel('6º Semestre').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('semester_7').setLabel('7º Semestre').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('semester_8').setLabel('8º Semestre').setStyle(ButtonStyle.Primary)
    );
  
    await interaction.reply({
      content: `${interaction.user}, escolha o seu semestre:`,
      components: [semesterButtonsRow1, semesterButtonsRow2],
      ephemeral: true,
    });
  }
  

  if (interaction.customId.startsWith('semester_')) {
    const selectedSemester = interaction.customId.split('_')[1];

    const confirmationButtons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`confirm_${selectedSemester}`)
        .setLabel('Sim')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('cancel_selection')
        .setLabel('Não')
        .setStyle(ButtonStyle.Danger)
    );

    await interaction.reply({
      content: `Você escolheu o ${selectedSemester}º semestre. Tem certeza?`,
      components: [confirmationButtons],
      ephemeral: true,
    });
  }

  if (interaction.customId.startsWith('confirm_')) {
    const selectedSemester = interaction.customId.split('_')[1];
    const roleId = semesterRoles[selectedSemester];

    if (!roleId) {
      return interaction.reply({
        content: 'Cargo não encontrado para o semestre escolhido.',
        ephemeral: true,
      });
    }

    try {
      await interaction.member.roles.add(roleId);

      await interaction.reply({
        content: `Você recebeu o cargo do ${selectedSemester}º semestre!`,
        ephemeral: true,
      });

      const tempChannel = interaction.channel;
      await tempChannel.delete();
    } catch (error) {
      console.error(error);
      interaction.reply({ content: 'Erro ao atribuir o cargo.', ephemeral: true });
    }
  }

  if (interaction.customId === 'cancel_selection') {
    const semesterButtons = new ActionRowBuilder().addComponents(
      ...Array.from({ length: 8 }, (_, i) =>
        new ButtonBuilder()
          .setCustomId(`semester_${i + 1}`)
          .setLabel(`${i + 1}º Semestre`)
          .setStyle(ButtonStyle.Primary)
      )
    );

    await interaction.reply({
      content: 'Escolha novamente o seu semestre:',
      components: [semesterButtons],
      ephemeral: true,
    });
  }

  if (interaction.customId === 'course_other') {
    await interaction.reply({
      content: 'Você não pode se registrar com outro curso.',
      ephemeral: true,
    });

    const tempChannel = interaction.channel;
    await tempChannel.delete();
  }
});

client.login(process.env.TOKEN);
