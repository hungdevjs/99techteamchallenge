import { connectMongoDB } from '../configs/mongoose.config';

import Nation from '../models/nation.model';
import Club from '../models/club.model';
import Coach from '../models/coach.model';
import Player from '../models/player.model';

const main = async () => {
  try {
    await connectMongoDB();

    await Nation.deleteMany({});
    await Club.deleteMany({});
    await Coach.deleteMany({});
    await Player.deleteMany({});

    console.log('creating nations...');
    const nationsData = [
      { name: 'Vietnam', flagURL: 'https://flagcdn.com/vn.svg' },
      { name: 'England', flagURL: 'https://flagcdn.com/gb.svg' },
      { name: 'Spain', flagURL: 'https://flagcdn.com/es.svg' },
      { name: 'Germany', flagURL: 'https://flagcdn.com/de.svg' },
      { name: 'France', flagURL: 'https://flagcdn.com/fr.svg' },
    ];
    const nations = await Nation.insertMany(nationsData);

    const clubNames = [
      'Manchester United',
      'Liverpool',
      'Chelsea',
      'Arsenal',
      'Manchester City',
      'Real Madrid',
      'Barcelona',
      'Atletico Madrid',
      'Bayern Munich',
      'Borussia Dortmund',
      'Paris Saint-Germain',
      'Juventus',
      'AC Milan',
      'Inter Milan',
      'Tottenham Hotspur',
      'Ajax',
      'Benfica',
      'FC Porto',
      'Bayer Leverkusen',
      'Napoli',
    ];

    const coachNames = [
      'Sir Alex Ferguson',
      'Pep Guardiola',
      'Jurgen Klopp',
      'Jose Mourinho',
      'Carlo Ancelotti',
      'Zinedine Zidane',
      'Arsene Wenger',
      'Diego Simeone',
      'Antonio Conte',
      'Thomas Tuchel',
      'Erik ten Hag',
      'Xavi Hernandez',
      'Luis Enrique',
      'Mikel Arteta',
      'Unai Emery',
      'Mauricio Pochettino',
      'Julian Nagelsmann',
      'Massimiliano Allegri',
      'Roberto Mancini',
      'Gareth Southgate',
    ];

    const playerFirstNames = [
      'Lionel',
      'Cristiano',
      'Kylian',
      'Erling',
      'Kevin',
      'Mohamed',
      'Robert',
      'Luka',
      'Harry',
      'Karim',
    ];
    const playerLastNames = [
      'Messi',
      'Ronaldo',
      'Mbappe',
      'Haaland',
      'De Bruyne',
      'Salah',
      'Lewandowski',
      'Modric',
      'Kane',
      'Benzema',
    ];

    console.log('creating clubs, coaches and players...');
    for (let i = 0; i < 20; i++) {
      const nation = nations[i % nations.length];

      const coach = await Coach.create({
        name: coachNames[i],
        nationality: nation._id,
        yob: 1960 + Math.floor(Math.random() * 30),
      });

      const club = await Club.create({
        name: clubNames[i],
        nationality: nation._id,
        logoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${clubNames[i]}`,
        headCoach: coach._id,
        numberOfPlayers: 11,
      });

      await Coach.findByIdAndUpdate(coach._id, { club: club._id });

      const players = [];
      for (let j = 0; j < 11; j++) {
        players.push({
          name: `${playerFirstNames[Math.floor(Math.random() * playerFirstNames.length)]} ${playerLastNames[Math.floor(Math.random() * playerLastNames.length)]} ${i}-${j}`,
          club: club._id,
          nationality: nations[Math.floor(Math.random() * nations.length)]._id,
          yob: 1990 + Math.floor(Math.random() * 15),
        });
      }
      await Player.insertMany(players);
    }

    console.log('created clubs');
  } catch (err) {
    console.error(err);
  }
};

main();
