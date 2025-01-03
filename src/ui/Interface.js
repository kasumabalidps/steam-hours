const chalk = require('chalk');
const readlineSync = require('readline-sync');

class Interface {
    constructor(config) {
        this.config = config;
    }

    printHeader() {
        console.clear();
        console.log(this.getHeaderText());
    }

    getHeaderText() {
        return `
    ${chalk.blue.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}
    ${chalk.blue.bold('                     S T E A M   B O T                    ')}
    ${chalk.blue.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}
    ${chalk.gray.bold('                     Version ' + this.config.bot.version + '                    ')}
    ${chalk.gray.bold('              github.com/kasumabalidps               ')}
    ${chalk.blue.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}`;
    }

    async getCredentials() {
        this.printHeader();
        console.log(chalk.blue.bold('\n[ LOGIN CREDENTIALS ]'));
        console.log(chalk.gray.bold('━━━━━━━━━━━━━━━━━━━━\n'));

        return {
            username: readlineSync.question(chalk.white.bold("⦿ Username  : ")),
            password: readlineSync.question(chalk.white.bold("⦿ Password  : "), { hideEchoBack: true }),
            hasTwoFactorCode: readlineSync.keyInYNStrict(chalk.white.bold("⦿ Use Steam Guard? ")),
            appearOnline: readlineSync.keyInYNStrict(chalk.white.bold("⦿ Appear Online? "))
        };
    }

    displayError(message) {
        console.log();
        console.log(chalk.red.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
        console.log(chalk.red.bold(`  Error: ${message}  `));
        console.log(chalk.red.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    }

    displaySuccess(message) {
        console.log(chalk.green.bold(`✓ ${message}`));
    }
}

module.exports = Interface; 