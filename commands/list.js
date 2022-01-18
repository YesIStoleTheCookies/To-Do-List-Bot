const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const userSchema = require('../models/userSchema.js');


module.exports = {
    name: 'list',
    category: 'read',
    description: 'reads and prints the to-do list',
    usage: `list`,
    async execute(message, args, command, client, Discord, db){
        //check args
        var userid = message.author.id;
        const activeUser = await userSchema.findOne({ uid: userid }); // find user
        if (!activeUser) {
          return;
        }
        activeUser.tasks = activeUser.tasks.sort((a, b) => a.date - b.date);
        for (var i; i< activeUser.tasks.length;i++) {
          activeUser.tasks[i].id = i;
        }

        if(!args[0]){ //DEFAULT LIST
          //list lastDate list

          let taskList = '';
          let formattedTask = ''; // set up task collectors
          let dateList='';

          var today = new Date();
          var date = activeUser.lastListDate;
          if (date < today) {
            date = today;
          }
          const reformattedDate = date.toString().slice(0,15);
          for (var i = 0; i < activeUser.tasks.length; i++) {
            //check if task is outdated
            if(activeUser.tasks[i].date < date) {
              if (activeUser.tasks[i].complete){
                activeUser.tasks[i].remove();
                continue;
              }
              else {
                activeUser.tasks[i].date = date;
              }
            }
            //GENERATE STRING
            if (activeUser.tasks[i].date.toString().slice(0,15) == reformattedDate) {
              dateList += activeUser.tasks[i].date.toString().slice(0,10) + "\n";
              formattedTask = i + ". " //number
              formattedTask += activeUser.tasks[i].name;
              if (activeUser.mobile) { //25 char wrap
                if(formattedTask.length > 25) {
                  lines = formattedTask.length / 25
                  var temp = formattedTask;
                  formattedTask=""
                  for (var j = 0; j < lines; j++) {
                    formattedTask+=temp.slice(25*j, 25*j+25)+"\n"
                    dateList+="\n";
                  }
                }
              }

              if (activeUser.tasks[i].complete) {
                formattedTask = '~~' + formattedTask + '~~';
              } else if (activeUser.tasks[i].rem) {
                formattedTask += " 🔔";
              }// assemble task line
              taskList += formattedTask + '\n'; // add task line to list
            }

          }
          if(taskList.length === 0){
            taskList = "You have no tasks!"
            dateList = "and no dates..."
          }
          const embed = new MessageEmbed()
          .setColor("#9B59B6")//purple
          .setTitle("__"+message.author.username+'\'s To-do '+date.toString().slice(0,15)+"__") // add date
          .addFields(
          	{ name: 'Tasks:', value: taskList, inline: true }
          );

          let thisMessage = await message.channel.send(embed);
          activeUser.lastList.set(0, thisMessage.guild.id);
          activeUser.lastList.set(1, thisMessage.channel.id);
          activeUser.lastList.set(2, thisMessage.id);
          activeUser.lastListDate = date;
          await activeUser.save();
          console.log(activeUser.lastList)

        }











        else if(args[0]==='all'){ // LIST ALL

          let taskList = '';
          let dateList = '';
          let formattedTask = ''; // set up task collectors
          var date = new Date();

          for (var i = 0; i < activeUser.tasks.length; i++) {
            var lines = 0; //extra lines
            if(activeUser.tasks[i].date < date) {
              if (activeUser.tasks[i].complete){
                activeUser.tasks[i].remove();
                i--;
              }
              else{
                dateList += activeUser.tasks[i].date.toString().slice(0,10) + "\n";
                formattedTask = i + ". " //number
                formattedTask += activeUser.tasks[i].name+"\n";
                if (activeUser.mobile) { //25 char wrap
                  if(formattedTask.length > 25) {
                    lines = formattedTask.length / 25
                    var temp = formattedTask;
                    for (var j = 0; j < lines; j++) {
                      formattedTask+=temp.slice(25*j, 25*j+25)+"\n"
                      dateList+="\n";
                    }
                  }
                }

                taskList += formattedTask;
              }
            }
            else {

              dateList += activeUser.tasks[i].date.toString().slice(0,10) + "\n";
              formattedTask = i + ". " //number
              formattedTask += activeUser.tasks[i].name;
              if (activeUser.mobile) { //25 char wrap
                if(formattedTask.length > 25) {
                  lines = formattedTask.length / 25
                  var temp = formattedTask;
                  formattedTask=""
                  for (var j = 0; j < lines; j++) {
                    formattedTask+=temp.slice(25*j, 25*j+25)+"\n"
                    dateList+="\n";
                  }
                }
              }

              if (activeUser.tasks[i].complete) {
                formattedTask = '~~' + formattedTask + '~~';
              } else if (activeUser.tasks[i].rem) {
                formattedTask += " 🔔";
              }// assemble task line
              taskList += formattedTask + '\n'; // add task line to list
            }



          }
          if(taskList.length === 0){
            taskList = "You have no tasks!"
            dateList = "and no dates..."
          }

          const embed = new MessageEmbed()
          .setColor("#9B59B6")
          .setTitle("__"+message.author.username+'\'s List of All Tasks__') // add date
          .addFields(
          	{ name: 'Tasks:', value: taskList, inline: true },
          	{ name: 'Due:', value: dateList, inline: true },
          );

          let thisMessage = await message.channel.send(embed);
          activeUser.lastListAll.set(0, thisMessage.guild.id);
          activeUser.lastListAll.set(1, thisMessage.channel.id);
          activeUser.lastListAll.set(2, thisMessage.id);
          //activeUser.lastListDate = date;
          await activeUser.save();
          console.log(activeUser.lastListAll)

        }










        else{ // LIST DATE
          var date = new Date(args[0]);
          if (isNaN(date)){
            const embed = new MessageEmbed()
            .setColor("#E74C3C")//dark red
            .setTitle('Invalid Date!')
            .setDescription(args[0]);

            message.channel.send(embed);
          }
          else{

            let taskList = '';
            let dateList = '';
            let formattedTask = ''; // set up task collectors
            const reformattedDate = date.toString().slice(0,15);
            for (var i = 0; i < activeUser.tasks.length; i++) {
              //check if task is outdated
              if(activeUser.tasks[i].date < date) {
                if (activeUser.tasks[i].complete){
                  activeUser.tasks[i].remove();
                  continue;
                }
                else {
                  activeUser.tasks[i].date = date;
                }
              }
              //GENERATE STRING
              if (activeUser.tasks[i].date.toString().slice(0,15) == reformattedDate) {
                dateList += activeUser.tasks[i].date.toString().slice(0,10) + "\n";
                formattedTask = i + ". " //number
                formattedTask += activeUser.tasks[i].name+"\n";
                if (activeUser.mobile) { //25 char wrap
                  if(formattedTask.length > 25) {
                    lines = formattedTask.length / 25
                    var temp = formattedTask;
                    formattedTask=""
                    for (var j = 0; j < lines; j++) {
                      formattedTask+=temp.slice(25*j, 25*j+25)+"\n"
                      dateList+="\n";
                    }
                  }
                }


                if (activeUser.tasks[i].complete) {
                  formattedTask = '~~' + formattedTask + '~~';
                } else if (activeUser.tasks[i].rem) {
                  formattedTask += " 🔔";
                }// assemble task line
                taskList += formattedTask + '\n'; // add task line to list
              }

            }
            if(taskList.length === 0){
              taskList = "You have no tasks!"
              dateList = "and no dates..."
            }
            const embed = new MessageEmbed()
            .setColor("#9B59B6")//purple
            .setTitle("__"+message.author.username+'\'s To-do '+date.toString().slice(0,15)+"__") // add date
            .addFields(
            	{ name: 'Tasks:', value: taskList, inline: true }
            );

            let thisMessage = await message.channel.send(embed);
            activeUser.lastList.set(0, thisMessage.guild.id);
            activeUser.lastList.set(1, thisMessage.channel.id);
            activeUser.lastList.set(2, thisMessage.id);
            activeUser.lastListDate = date;
            await activeUser.save();
            console.log(activeUser.lastList)
          }
        }
    }
}
