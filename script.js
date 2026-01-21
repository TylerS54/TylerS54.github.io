// Modern Terminal Interface
class Terminal {
    constructor() {
        this.commandHistory = [];
        this.historyIndex = -1;
        this.idleTimer = null;
        this.commands = {
            help: () => this.showHelp(),
            '?': () => this.showHelp(),
            about: () => this.showAbout(),
            skills: () => this.showSkills(),
            contact: () => this.showContact(),
            social: () => this.showSocial(),
            clear: () => this.clearTerminal(),
            cls: () => this.clearTerminal(),
            theme: () => this.toggleTheme(),
            whoami: () => 'tyler',
            pwd: () => '/home/tyler',
            ls: () => 'about.md  skills.md  contact.md  social.md',
            date: () => new Date().toLocaleString(),
            uptime: () => 'System online since page load',
            echo: (args) => args.join(' '),
            cat: (args) => this.catFile(args[0]),
            ping: () => 'pong 🏓',
            coffee: () => '☕ Here\'s your coffee! Ready to code.',
            fortune: () => this.getFortune(),
            exit: () => 'Thanks for visiting! 👋',
            version: () => 'tlr.sh terminal v1.0.0'
        };
        
        this.init();
    }

    init() {
        this.commandInput = document.getElementById('commandInput');
        this.commandHistoryEl = document.getElementById('commandHistory');
        this.helpMenu = document.getElementById('helpMenu');
        
        this.commandInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.commandInput.addEventListener('input', () => this.resetIdleTimer());
        this.commandInput.focus();
        
        // Update time
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
        
        // Start idle timer
        this.resetIdleTimer();
        
        // Welcome message
        setTimeout(() => {
            this.addOutput('Terminal ready. Type a command to get started.', 'info');
        }, 1000);
        
        // ESC key for help menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.toggleHelp();
            }
        });
        
        // Click outside help menu to close
        document.addEventListener('click', (e) => {
            if (this.helpMenu.classList.contains('active') && !this.helpMenu.contains(e.target)) {
                this.helpMenu.classList.remove('active');
            }
        });
    }

    handleKeyDown(e) {
        this.resetIdleTimer();
        
        switch(e.key) {
            case 'Enter':
                this.executeCommand();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.navigateHistory(-1);
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.navigateHistory(1);
                break;
            case 'Tab':
                e.preventDefault();
                this.autocomplete();
                break;
        }
    }

    executeCommand() {
        const input = this.commandInput.value.trim();
        if (!input) return;

        // Add command to history
        this.addCommandToHistory(input);
        
        // Parse command and arguments
        const [command, ...args] = input.toLowerCase().split(' ');
        
        // Execute command
        if (this.commands[command]) {
            const result = this.commands[command](args);
            if (result) {
                this.addOutput(result, 'success');
            }
        } else {
            this.addOutput(`Command not found: ${command}`, 'error');
            this.addOutput('Type "help" or "?" to see available commands.', 'info');
        }
        
        // Clear input
        this.commandInput.value = '';
        this.historyIndex = -1;
    }

    addCommandToHistory(command) {
        // Display command in terminal
        const commandLine = document.createElement('div');
        commandLine.className = 'command-line';
        commandLine.innerHTML = `
            <span class="command-prompt">$</span>
            <span class="command-text">${command}</span>
        `;
        this.commandHistoryEl.appendChild(commandLine);
        
        // Add to history array
        this.commandHistory.unshift(command);
        if (this.commandHistory.length > 50) {
            this.commandHistory.pop();
        }
        
        this.scrollToBottom();
    }

    addOutput(text, type = 'normal') {
        const output = document.createElement('div');
        output.className = `command-output ${type}`;
        output.textContent = text;
        this.commandHistoryEl.appendChild(output);
        this.scrollToBottom();
    }

    navigateHistory(direction) {
        if (this.commandHistory.length === 0) return;
        
        this.historyIndex += direction;
        
        if (this.historyIndex < -1) {
            this.historyIndex = -1;
        } else if (this.historyIndex >= this.commandHistory.length) {
            this.historyIndex = this.commandHistory.length - 1;
        }
        
        if (this.historyIndex === -1) {
            this.commandInput.value = '';
        } else {
            this.commandInput.value = this.commandHistory[this.historyIndex];
        }
    }

    autocomplete() {
        const input = this.commandInput.value.toLowerCase();
        const matches = Object.keys(this.commands).filter(cmd => cmd.startsWith(input));
        
        if (matches.length === 1) {
            this.commandInput.value = matches[0];
        } else if (matches.length > 1) {
            this.addOutput(`Available: ${matches.join(', ')}`, 'info');
        }
    }

    scrollToBottom() {
        const terminalBody = document.querySelector('.terminal-body');
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    resetIdleTimer() {
        const asciiIdle = document.getElementById('asciiIdle');
        if (asciiIdle) {
            asciiIdle.classList.remove('show');
        }
        
        if (this.idleTimer) {
            clearTimeout(this.idleTimer);
        }
        
        this.idleTimer = setTimeout(() => {
            if (asciiIdle && this.commandHistoryEl.children.length > 0) {
                asciiIdle.classList.add('show');
            }
        }, 10000); // Show after 10 seconds of inactivity
    }

    // Command implementations
    showHelp() {
        this.toggleHelp();
    }

    showAbout() {
        return `About Tyler

I'm a passionate DevOps Engineer who loves building things that matter. 
I enjoy working with modern technologies, solving complex problems, 
and creating elegant solutions.

When I'm not coding, you'll find me exploring new AI tools, 
contributing to open source projects, or sharing knowledge with 
the community.

Philosophy: Move forward, always.`;
    }

    showSkills() {
        return `Technical Skills

Languages:
    Python                         ███████████  Advanced
    JavaScript                     ██████████   Advanced
    Bash                           █████████    Intermediate
    SQL                            ████████     Intermediate


Data, Observability & Tooling:
    Log Analysis & Correlation     ████████████ Expert
    Dashboards & Metrics           ██████████   Advanced
    Incident Triage Automation     ████████████ Expert


Cloud & Infrastructure:
    AWS (Media Services, EC2, S3)  ██████████   Advanced
    On-Prem Video Systems          ██████████   Advanced
    Linux Systems                  ██████████   Advanced
    Networking (CDN, IP Video)     ██████████   Advanced


Engineering & Operations:
    Root Cause Analysis            ████████████ Expert
    Production Incident Response   ████████████ Expert
    Runbooks & SOP Development     ██████████   Advanced
    Cross-Team Escalations         ██████████   Advanced


DevOps & Collaboration:
    Git/GitHub                     ██████████   Advanced
    CI / Operational Tooling       ████████     Intermediate
    Automation-Driven Workflows    ██████████   Advanced
 `;
    }

    showContact() {
        return `Contact Information

📧 Email:     TylerShaller@gmail.com
🌐 Website:   https://tlr.sh
💬 Discord:   tylers

I'm always open to interesting conversations about collaboration opportunities.
Response time: Usually within 24 hours.`;
    }

    showSocial() {
        return `Social Links

🐙 GitHub:     https://github.com/TylerS54
💬 Discord:   tylers

.`;
    }

    catFile(filename) {
        const files = {
            'about.md': this.showAbout(),
            'skills.md': this.showSkills(),
            'contact.md': this.showContact(),
            'social.md': this.showSocial()
        };
        
        return files[filename] || `cat: ${filename}: No such file or directory`;
    }

    getFortune() {
        const fortunes = [
            "Code is poetry written in logic.",
            "The best code is no code at all.",
            "Premature optimization is the root of all evil.",
            "Make it work, make it right, make it fast.",
            "Code never lies, comments sometimes do.",
            "Debugging is twice as hard as writing the code.",
            "Good code is its own best documentation.",
            "Programs must be written for people to read.",
            "Simplicity is the ultimate sophistication.",
            "Any fool can write code that a computer can understand."
        ];
        
        return fortunes[Math.floor(Math.random() * fortunes.length)];
    }

    clearTerminal() {
        this.commandHistoryEl.innerHTML = '';
        this.addOutput('Terminal cleared.', 'info');
        this.resetIdleTimer();
    }

    toggleHelp() {
        this.helpMenu.classList.toggle('active');
    }

    toggleTheme() {
        this.addOutput('Theme toggle feature coming soon!', 'info');
    }

    updateTime() {
        const timeElement = document.getElementById('currentTime');
        if (timeElement) {
            const now = new Date();
            timeElement.textContent = now.toLocaleTimeString();
        }
    }
}

// Initialize terminal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Terminal();
    
    // Focus on input
    const input = document.getElementById('commandInput');
    if (input) {
        input.focus();
        
        // Keep focus on input when clicking anywhere
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.help-menu')) {
                input.focus();
            }
        });
    }
});

// Easter Egg: Konami Code
let konamiSequence = [];
const konamiCode = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

function activateKonamiEasterEgg() {
    const terminal = document.querySelector('.terminal-body');
    const logo = document.querySelector('.logo-text');
    
    // Create special effect
    document.body.style.transition = 'all 0.5s ease';
    document.body.style.filter = 'hue-rotate(180deg) saturate(1.5)';
    
    // Add rainbow gradient to logo
    if (logo) {
        logo.style.background = 'linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)';
        logo.style.backgroundSize = '400% 400%';
        logo.style.animation = 'rainbow 2s ease infinite';
        logo.style.webkitBackgroundClip = 'text';
        logo.style.webkitTextFillColor = 'transparent';
    }
    
    // Add rainbow animation CSS
    const style = document.createElement('style');
    style.id = 'konami-styles';
    style.textContent = `
        @keyframes rainbow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        .sparkle {
            position: fixed;
            width: 4px;
            height: 4px;
            background: white;
            border-radius: 50%;
            pointer-events: none;
            animation: sparkle 1s ease-in-out;
            z-index: 9999;
        }
        
        @keyframes sparkle {
            0%, 100% { opacity: 0; transform: scale(0); }
            50% { opacity: 1; transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
    
    // Create sparkle effects
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = Math.random() * window.innerWidth + 'px';
            sparkle.style.top = Math.random() * window.innerHeight + 'px';
            document.body.appendChild(sparkle);
            
            setTimeout(() => sparkle.remove(), 1000);
        }, i * 100);
    }
    
    // Show special message in terminal
    const commandHistory = document.getElementById('commandHistory');
    const easterEggMessage = document.createElement('div');
    easterEggMessage.className = 'command-output success';
    easterEggMessage.innerHTML = `
🎉 KONAMI CODE ACTIVATED! 🎉

    ██╗  ██╗ ██████╗ ███╗   ██╗ █████╗ ███╗   ███╗██╗
    ██║ ██╔╝██╔═══██╗████╗  ██║██╔══██╗████╗ ████║██║
    █████╔╝ ██║   ██║██╔██╗ ██║███████║██╔████╔██║██║
    ██╔═██╗ ██║   ██║██║╚██╗██║██╔══██║██║╚██╔╝██║██║
    ██║  ██╗╚██████╔╝██║ ╚████║██║  ██║██║ ╚═╝ ██║██║
    ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝

You found the secret! 🕹️ 
Welcome to the rainbow dimension of tlr.sh!
    `;
    commandHistory.appendChild(easterEggMessage);
    
    // Scroll to show the message
    terminal.scrollTop = terminal.scrollHeight;
    
    // Reset after 5 seconds
    setTimeout(() => {
        document.body.style.filter = 'none';
        document.body.style.transition = '';
        
        if (logo) {
            logo.style.background = '';
            logo.style.backgroundSize = '';
            logo.style.animation = '';
            logo.style.webkitBackgroundClip = '';
            logo.style.webkitTextFillColor = '';
        }
        
        const konamiStyles = document.getElementById('konami-styles');
        if (konamiStyles) {
            konamiStyles.remove();
        }
        
        const resetMessage = document.createElement('div');
        resetMessage.className = 'command-output info';
        resetMessage.textContent = 'Reality restored. Thanks for playing! 🎮';
        commandHistory.appendChild(resetMessage);
        terminal.scrollTop = terminal.scrollHeight;
    }, 5000);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Konami Code detection
    konamiSequence.push(e.code);
    
    if (konamiSequence.length > 10) {
        konamiSequence.shift();
    }
    
    if (konamiSequence.length === 10 && 
        konamiSequence.every((key, index) => key === konamiCode[index])) {
        activateKonamiEasterEgg();
        konamiSequence = [];
    }
    
    // Ctrl+L (clear)
    if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        document.getElementById('commandHistory').innerHTML = '';
    }
    
    // Ctrl+C (interrupt)
    if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        const output = document.createElement('div');
        output.className = 'command-output';
        output.textContent = '^C';
        document.getElementById('commandHistory').appendChild(output);
    }
});