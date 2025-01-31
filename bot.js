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

const computerScienceRole = {
  1: '1334652619309977660',
  2: '1334652761584959569',
  3: '1334652837514313750',
  4: '1334652899384623185',
  5: '1334652970419093697',
  6: '1334653035590320139',
  7: '1334653137541267616',
  8: '1334653189592584212',
}

const softwareEngineerRole = {
  1: '1334653435282460702',
  2: '1334653513917267968',
  3: '1334653601426968596',
  4: '1334653688618156054',
  5: '1334653759736778803',
  6: '1334653821044916305',
  7: '1334653888523010150',
  8: '1334653974510440468',
}

const adsRole = {
  1: '1334654034023419957',
  2: '1334654128860954684',
  3: '1334654213799804958',
  4: '1334654274285731941',
}

client.once('ready', () => {
  console.log(`Bot está online como ${client.user.tag}`);
});

let selectedCourseRole = null;

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
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('course_es')
        .setLabel('Engenharia de Software')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('course_ads')
        .setLabel('Análise e Desenvolvimento de Sistemas')
        .setStyle(ButtonStyle.Secondary),
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
    selectedCourseRole = computerScienceRole;
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

  if (interaction.customId === 'course_es') {
    selectedCourseRole = softwareEngineerRole;
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

  if (interaction.customId === 'course_ads') {
    selectedCourseRole = adsRole;
    const semesterButtonsRow1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('semester_1').setLabel('1º Semestre').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('semester_2').setLabel('2º Semestre').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('semester_3').setLabel('3º Semestre').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('semester_4').setLabel('4º Semestre').setStyle(ButtonStyle.Primary)
    );
  
    await interaction.reply({
      content: `${interaction.user}, escolha o seu semestre:`,
      components: [semesterButtonsRow1],
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
    const courseRoleId = selectedCourseRole[selectedSemester];

    if (!courseRoleId) {
      return interaction.reply({
        content: 'Cargo não encontrado para o semestre escolhido.',
        ephemeral: true,
      });
    }

    try {
      await interaction.member.roles.add(courseRoleId);

      await interaction.reply({
        content: `Você recebeu o cargo do ${selectedSemester}º semestre do seu curso!`,
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
    try {
      await interaction.reply({
        content: 'Você escolheu um curso não permitido. Você será banido do servidor.',
        ephemeral: true,
      });

      // Ban the user
      await interaction.member.ban({
        reason: 'Tentativa de registro com curso não permitido'
      });

      const tempChannel = interaction.channel;
      await tempChannel.delete();
    } catch (error) {
      console.error('Erro ao banir usuário:', error);
      await interaction.reply({
        content: 'Ocorreu um erro ao tentar banir você.',
        ephemeral: true,
      });
    }
  }
});

client.login(process.env.TOKEN);