# Brebaje CLI Installation Script for Windows (PowerShell)
# Requires PowerShell 5.1+ and Windows 10/11

param(
    [switch]$Force = $false
)

# Enable strict mode and better error handling
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# Color functions for better output
function Write-Success { param($Message) Write-Host "✅ $Message" -ForegroundColor Green }
function Write-Error { param($Message) Write-Host "❌ $Message" -ForegroundColor Red }
function Write-Warning { param($Message) Write-Host "⚠️ $Message" -ForegroundColor Yellow }
function Write-Info { param($Message) Write-Host "🔍 $Message" -ForegroundColor Cyan }
function Write-Progress { param($Message) Write-Host "⚡ $Message" -ForegroundColor Blue }

Write-Host @"

🚀 Brebaje CLI Installation for Windows
======================================

"@ -ForegroundColor Magenta

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Warning "Some installations may require administrator privileges."
    Write-Host "Consider running as administrator if installations fail." -ForegroundColor Yellow
    Write-Host ""
}

# Detect package managers
$packageManagers = @{}

Write-Info "Detecting package managers..."

# Check for winget
try {
    $null = Get-Command winget -ErrorAction Stop
    $packageManagers['winget'] = $true
    Write-Success "winget is available"
} catch {
    $packageManagers['winget'] = $false
    Write-Warning "winget not available"
}

# Check for chocolatey
try {
    $null = Get-Command choco -ErrorAction Stop
    $packageManagers['chocolatey'] = $true
    Write-Success "chocolatey is available"
} catch {
    $packageManagers['chocolatey'] = $false
    Write-Warning "chocolatey not available"
}

Write-Host ""

# Function to install packages using available package managers
function Install-Package {
    param(
        [string]$PackageName,
        [string]$WingetId = "",
        [string]$ChocoName = "",
        [string]$FallbackUrl = ""
    )
    
    if ($packageManagers['winget'] -and $WingetId) {
        Write-Progress "Installing $PackageName using winget..."
        try {
            winget install --id $WingetId --accept-package-agreements --accept-source-agreements --silent
            return $true
        } catch {
            Write-Error "winget installation failed for $PackageName"
        }
    }
    
    if ($packageManagers['chocolatey'] -and $ChocoName) {
        Write-Progress "Installing $PackageName using chocolatey..."
        try {
            choco install $ChocoName -y
            return $true
        } catch {
            Write-Error "chocolatey installation failed for $PackageName"
        }
    }
    
    if ($FallbackUrl) {
        Write-Warning "Please install $PackageName manually from: $FallbackUrl"
    }
    
    return $false
}

# Function to check if command exists
function Test-Command {
    param([string]$Command)
    try {
        $null = Get-Command $Command -ErrorAction Stop
        return $true
    } catch {
        return $false
    }
}

# Function to compare versions
function Compare-Version {
    param(
        [string]$Current,
        [string]$Required
    )
    try {
        $currentVersion = [System.Version]::Parse($Current -replace '^v', '')
        $requiredVersion = [System.Version]::Parse($Required)
        return $currentVersion -ge $requiredVersion
    } catch {
        return $false
    }
}

# Check Node.js
Write-Info "Checking Node.js..."
$nodeRequired = "22.17.1"

if (Test-Command "node") {
    try {
        $nodeVersion = (node --version) -replace '^v', ''
        if (Compare-Version -Current $nodeVersion -Required $nodeRequired) {
            Write-Success "Node.js $nodeVersion (>= $nodeRequired required)"
        } else {
            Write-Error "Node.js $nodeVersion found, but >= $nodeRequired required"
            Write-Progress "Attempting to upgrade Node.js..."
            
            $upgraded = Install-Package -PackageName "Node.js" -WingetId "OpenJS.NodeJS" -ChocoName "nodejs" -FallbackUrl "https://nodejs.org/"
            if (-not $upgraded) {
                Write-Error "Failed to upgrade Node.js automatically"
                Write-Host "Please upgrade Node.js manually: https://nodejs.org/" -ForegroundColor Red
                exit 1
            }
            
            # Refresh PATH and check again
            $env:PATH = [System.Environment]::GetEnvironmentVariable("PATH", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH", "User")
            if (Test-Command "node") {
                $newNodeVersion = (node --version) -replace '^v', ''
                Write-Success "Node.js upgraded to $newNodeVersion"
            }
        }
    } catch {
        Write-Error "Error checking Node.js version"
        exit 1
    }
} else {
    Write-Error "Node.js not found"
    Write-Progress "Attempting to install Node.js..."
    
    $installed = Install-Package -PackageName "Node.js" -WingetId "OpenJS.NodeJS" -ChocoName "nodejs" -FallbackUrl "https://nodejs.org/"
    if (-not $installed) {
        Write-Error "Failed to install Node.js automatically"
        Write-Host "Please install Node.js manually >= $nodeRequired : https://nodejs.org/" -ForegroundColor Red
        exit 1
    }
    
    # Refresh PATH and verify installation
    $env:PATH = [System.Environment]::GetEnvironmentVariable("PATH", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH", "User")
    if (Test-Command "node") {
        $nodeVersion = (node --version) -replace '^v', ''
        Write-Success "Node.js $nodeVersion installed successfully"
    } else {
        Write-Error "Node.js installation verification failed"
        exit 1
    }
}

# Check pnpm
Write-Info "Checking pnpm..."
$pnpmRequired = "9.0.0"

if (Test-Command "pnpm") {
    try {
        $pnpmVersion = pnpm --version
        if (Compare-Version -Current $pnpmVersion -Required $pnpmRequired) {
            Write-Success "pnpm $pnpmVersion (>= $pnpmRequired required)"
        } else {
            Write-Error "pnpm $pnpmVersion found, but >= $pnpmRequired required"
            Write-Host "Please upgrade pnpm: npm install -g pnpm@latest" -ForegroundColor Red
            exit 1
        }
    } catch {
        Write-Error "Error checking pnpm version"
        exit 1
    }
} else {
    Write-Error "pnpm not found"
    
    if (Test-Command "npm") {
        Write-Progress "Attempting to install pnpm using npm..."
        try {
            npm install -g pnpm
            if (Test-Command "pnpm") {
                $pnpmVersion = pnpm --version
                Write-Success "pnpm $pnpmVersion installed successfully"
            } else {
                Write-Error "pnpm installation verification failed"
                exit 1
            }
        } catch {
            Write-Error "Failed to install pnpm automatically"
            Write-Host "Please install pnpm manually: npm install -g pnpm" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Error "npm not available for pnpm installation"
        Write-Host "Please install pnpm manually: https://pnpm.io/installation" -ForegroundColor Red
        exit 1
    }
}

# Check wget
Write-Info "Checking wget..."
if (Test-Command "wget") {
    Write-Success "wget is available"
} else {
    Write-Error "wget not found"
    Write-Progress "Attempting to install wget..."
    
    $installed = Install-Package -PackageName "wget" -WingetId "JernejSimoncic.Wget" -ChocoName "wget" -FallbackUrl "https://eternallybored.org/misc/wget/"
    if ($installed) {
        # Refresh PATH
        $env:PATH = [System.Environment]::GetEnvironmentVariable("PATH", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH", "User")
        if (Test-Command "wget") {
            Write-Success "wget installed successfully"
        }
    } else {
        Write-Error "Failed to install wget automatically"
        Write-Host "wget is required for downloading ceremony files" -ForegroundColor Red
        Write-Host "Please install wget manually from: https://eternallybored.org/misc/wget/" -ForegroundColor Red
        exit 1
    }
}

# Check curl
Write-Info "Checking curl..."
if (Test-Command "curl") {
    Write-Success "curl is available"
} else {
    Write-Error "curl not found"
    Write-Progress "Attempting to install curl..."
    
    $installed = Install-Package -PackageName "curl" -WingetId "curl.curl" -ChocoName "curl" -FallbackUrl "https://curl.se/windows/"
    if ($installed) {
        # Refresh PATH
        $env:PATH = [System.Environment]::GetEnvironmentVariable("PATH", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH", "User")
        if (Test-Command "curl") {
            Write-Success "curl installed successfully"
        }
    } else {
        Write-Error "Failed to install curl automatically"
        Write-Host "curl is required for uploading ceremony files" -ForegroundColor Red
        Write-Host "Please install curl manually from: https://curl.se/windows/" -ForegroundColor Red
        exit 1
    }
}

# Check snarkjs
Write-Info "Checking snarkjs..."
if (Test-Command "snarkjs") {
    try {
        $snarkjsVersion = (snarkjs --version 2>$null | Select-Object -First 1).Split(' ')[1]
        if (-not $snarkjsVersion) { $snarkjsVersion = "unknown" }
        Write-Success "snarkjs $snarkjsVersion is available"
    } catch {
        Write-Success "snarkjs is available"
    }
} else {
    Write-Error "snarkjs not found"
    
    if ((Test-Command "npm") -or (Test-Command "pnpm")) {
        Write-Progress "Attempting to install snarkjs..."
        try {
            if (Test-Command "npm") {
                npm install -g snarkjs
            } elseif (Test-Command "pnpm") {
                pnpm add -g snarkjs
            }
            
            if (Test-Command "snarkjs") {
                $snarkjsVersion = (snarkjs --version 2>$null | Select-Object -First 1).Split(' ')[1]
                if (-not $snarkjsVersion) { $snarkjsVersion = "installed" }
                Write-Success "snarkjs $snarkjsVersion installed successfully"
            } else {
                Write-Error "snarkjs installation verification failed"
                exit 1
            }
        } catch {
            Write-Error "Failed to install snarkjs automatically"
            Write-Host "snarkjs is required for Powers of Tau ceremony operations" -ForegroundColor Red
            Write-Host "Install snarkjs manually: npm install -g snarkjs" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Error "npm/pnpm not available for snarkjs installation"
        Write-Host "Please install snarkjs manually: npm install -g snarkjs" -ForegroundColor Red
        exit 1
    }
}

# Check and configure pnpm global bin directory
Write-Info "Checking pnpm global configuration..."
try {
    $pnpmGlobalBin = pnpm config get global-bin-dir 2>$null
    $recommendedBinDir = "$env:USERPROFILE\.local\bin"
    
    if (-not $pnpmGlobalBin -or $pnpmGlobalBin -eq "undefined") {
        Write-Warning "pnpm global-bin-dir not configured"
        Write-Progress "Setting up global bin directory: $recommendedBinDir"
        
        # Create directory if it doesn't exist
        if (-not (Test-Path $recommendedBinDir)) {
            New-Item -ItemType Directory -Path $recommendedBinDir -Force | Out-Null
        }
        
        # Configure pnpm
        pnpm config set global-bin-dir $recommendedBinDir
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "pnpm global-bin-dir configured successfully"
            $pnpmGlobalBin = $recommendedBinDir
        } else {
            Write-Error "Failed to configure pnpm global-bin-dir"
            exit 1
        }
    } else {
        Write-Success "pnpm global-bin-dir: $pnpmGlobalBin"
    }
    
    # Check if global bin directory is in PATH
    $currentPath = $env:PATH
    if ($currentPath -like "*$pnpmGlobalBin*") {
        Write-Success "Global bin directory is in PATH"
    } else {
        Write-Warning "Global bin directory not in PATH"
        Write-Host "After installation, you may need to add this to your PATH:" -ForegroundColor Yellow
        Write-Host "  $pnpmGlobalBin" -ForegroundColor Yellow
    }
} catch {
    Write-Warning "Could not configure pnpm global settings"
}

Write-Host ""
Write-Progress "Installing dependencies..."

# Install dependencies
try {
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Dependency installation failed!"
        exit 1
    }
} catch {
    Write-Error "Dependency installation failed!"
    exit 1
}

Write-Host ""
Write-Progress "Building Brebaje CLI..."

# Build the CLI
try {
    pnpm build
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Build failed!"
        exit 1
    }
} catch {
    Write-Error "Build failed!"
    exit 1
}

Write-Progress "Installing Brebaje CLI globally..."

# Install globally
try {
    pnpm link --global
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Installation successful!"
        Write-Host ""
        
        # Verify CLI is accessible
        Write-Info "Verifying CLI accessibility..."
        
        # Refresh PATH
        $env:PATH = [System.Environment]::GetEnvironmentVariable("PATH", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH", "User")
        
        if (Test-Command "brebaje-cli") {
            Write-Success "brebaje-cli is accessible in PATH"
            Write-Host ""
            Write-Host "🎉 Installation completed successfully!" -ForegroundColor Green
            Write-Host ""
            brebaje-cli --help
        } else {
            Write-Warning "brebaje-cli not found in PATH"
            Write-Host ""
            Write-Host "The installation succeeded, but the CLI may not be accessible." -ForegroundColor Yellow
            Write-Host "This usually happens when the global bin directory is not in PATH." -ForegroundColor Yellow
            Write-Host ""
            Write-Host "To fix this, add the following to your PATH:" -ForegroundColor Yellow
            Write-Host "  $pnpmGlobalBin" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "Or restart your PowerShell/Command Prompt and try again." -ForegroundColor Yellow
        }
    } else {
        Write-Error "Installation failed!"
        exit 1
    }
} catch {
    Write-Error "Installation failed!"
    exit 1
}

Write-Host ""
Write-Host "Creating input folder..." -ForegroundColor Cyan
if (-not (Test-Path "input")) {
    New-Item -ItemType Directory -Path "input" | Out-Null
    Write-Success "Input folder created"
} else {
    Write-Success "Input folder already exists"
}

Write-Host ""
Write-Host "Installation process completed!" -ForegroundColor Green