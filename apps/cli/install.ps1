# Brebaje CLI Installation Script for Windows (PowerShell)
# Requires PowerShell 5.1+ and Windows 10/11

param(
    [switch]$Force = $false
)

# Enable strict mode and better error handling
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# Color functions for better output
function Write-Success { param($Message) Write-Host "[OK] $Message" -ForegroundColor Green }
function Write-ErrorMsg { param($Message) Write-Host "[ERROR] $Message" -ForegroundColor Red }
function Write-WarningMsg { param($Message) Write-Host "[WARNING] $Message" -ForegroundColor Yellow }
function Write-InfoMsg { param($Message) Write-Host "[INFO] $Message" -ForegroundColor Cyan }
function Write-ProgressMsg { param($Message) Write-Host "[PROGRESS] $Message" -ForegroundColor Blue }

Write-Host ""
Write-Host "Brebaje CLI Installation for Windows" -ForegroundColor Magenta
Write-Host "====================================" -ForegroundColor Magenta
Write-Host ""

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-WarningMsg "Some installations may require administrator privileges."
    Write-Host "Consider running as administrator if installations fail." -ForegroundColor Yellow
    Write-Host ""
}

# Detect package managers
$packageManagers = @{}

Write-InfoMsg "Detecting package managers..."

# Check for winget
try {
    $null = Get-Command winget -ErrorAction Stop
    $packageManagers['winget'] = $true
    Write-Success "winget is available"
} catch {
    $packageManagers['winget'] = $false
    Write-WarningMsg "winget not available"
}

# Check for chocolatey
try {
    $null = Get-Command choco -ErrorAction Stop
    $packageManagers['chocolatey'] = $true
    Write-Success "chocolatey is available"
} catch {
    $packageManagers['chocolatey'] = $false
    Write-WarningMsg "chocolatey not available"
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
        Write-ProgressMsg "Installing $PackageName using winget..."
        Write-Host "This may take a few minutes..." -ForegroundColor Yellow
        try {
            $result = winget install --id $WingetId --accept-package-agreements --accept-source-agreements --silent
            Write-InfoMsg "winget installation completed for $PackageName"
            return $true
        } catch {
            Write-ErrorMsg "winget installation failed for $PackageName"
        }
    }
    
    if ($packageManagers['chocolatey'] -and $ChocoName) {
        Write-ProgressMsg "Installing $PackageName using chocolatey..."
        Write-Host "This may take a few minutes..." -ForegroundColor Yellow
        try {
            $result = choco install $ChocoName -y
            Write-InfoMsg "chocolatey installation completed for $PackageName"
            return $true
        } catch {
            Write-ErrorMsg "chocolatey installation failed for $PackageName"
        }
    }
    
    if ($FallbackUrl) {
        Write-WarningMsg "Please install $PackageName manually from: $FallbackUrl"
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
        # Clean up version strings
        $cleanCurrent = $Current -replace '^v', '' -replace '\s.*$', ''
        $cleanRequired = $Required -replace '^v', '' -replace '\s.*$', ''
        
        # Split version parts
        $currentParts = $cleanCurrent.Split('.') | ForEach-Object { [int]$_ }
        $requiredParts = $cleanRequired.Split('.') | ForEach-Object { [int]$_ }
        
        # Pad arrays to same length
        $maxLength = [Math]::Max($currentParts.Length, $requiredParts.Length)
        while ($currentParts.Length -lt $maxLength) { $currentParts += 0 }
        while ($requiredParts.Length -lt $maxLength) { $requiredParts += 0 }
        
        # Compare each part
        for ($i = 0; $i -lt $maxLength; $i++) {
            if ($currentParts[$i] -gt $requiredParts[$i]) { return $true }
            if ($currentParts[$i] -lt $requiredParts[$i]) { return $false }
        }
        
        return $true  # Equal versions
    } catch {
        Write-Host "Version comparison failed: Current='$Current', Required='$Required'" -ForegroundColor Yellow
        return $false
    }
}

# Function to refresh PATH
function Refresh-Path {
    $env:PATH = [System.Environment]::GetEnvironmentVariable("PATH", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH", "User")
}

# Check Node.js
Write-InfoMsg "Checking Node.js..."
$nodeRequired = "22.17.1"

if (Test-Command "node") {
    try {
        $nodeVersion = (node --version) -replace '^v', ''
        if (Compare-Version -Current $nodeVersion -Required $nodeRequired) {
            Write-Success "Node.js $nodeVersion (>= $nodeRequired required)"
        } else {
            Write-ErrorMsg "Node.js $nodeVersion found, but >= $nodeRequired required"
            Write-ProgressMsg "Attempting to upgrade Node.js..."
            
            $upgraded = Install-Package -PackageName "Node.js" -WingetId "OpenJS.NodeJS" -ChocoName "nodejs" -FallbackUrl "https://nodejs.org/"
            if (-not $upgraded) {
                Write-ErrorMsg "Failed to upgrade Node.js automatically"
                Write-Host "Please upgrade Node.js manually: https://nodejs.org/" -ForegroundColor Red
                exit 1
            }
            
            # Refresh PATH and check again
            Refresh-Path
            if (Test-Command "node") {
                $newNodeVersion = (node --version) -replace '^v', ''
                Write-Success "Node.js upgraded to $newNodeVersion"
            }
        }
    } catch {
        Write-ErrorMsg "Error checking Node.js version"
        exit 1
    }
} else {
    Write-ErrorMsg "Node.js not found"
    Write-ProgressMsg "Attempting to install Node.js..."
    
    $installed = Install-Package -PackageName "Node.js" -WingetId "OpenJS.NodeJS" -ChocoName "nodejs" -FallbackUrl "https://nodejs.org/"
    if (-not $installed) {
        Write-ErrorMsg "Failed to install Node.js automatically"
        Write-Host "Please install Node.js manually >= $nodeRequired : https://nodejs.org/" -ForegroundColor Red
        exit 1
    }
    
    # Refresh PATH and verify installation
    Refresh-Path
    if (Test-Command "node") {
        $nodeVersion = (node --version) -replace '^v', ''
        Write-Success "Node.js $nodeVersion installed successfully"
    } else {
        Write-ErrorMsg "Node.js installation verification failed"
        exit 1
    }
}

# Check pnpm
Write-InfoMsg "Checking pnpm..."
$pnpmRequired = "10.0.0"

if (Test-Command "pnpm") {
    try {
        $pnpmVersion = pnpm --version
        if (Compare-Version -Current $pnpmVersion -Required $pnpmRequired) {
            Write-Success "pnpm $pnpmVersion (>= $pnpmRequired required)"
        } else {
            Write-ErrorMsg "pnpm $pnpmVersion found, but >= $pnpmRequired required"
            Write-Host "Please upgrade pnpm: npm install -g pnpm@latest" -ForegroundColor Red
            exit 1
        }
    } catch {
        Write-ErrorMsg "Error checking pnpm version"
        exit 1
    }
} else {
    Write-ErrorMsg "pnpm not found"
    
    if (Test-Command "npm") {
        Write-ProgressMsg "Attempting to install pnpm using npm..."
        try {
            npm install -g pnpm
            if (Test-Command "pnpm") {
                $pnpmVersion = pnpm --version
                Write-Success "pnpm $pnpmVersion installed successfully"
            } else {
                Write-ErrorMsg "pnpm installation verification failed"
                exit 1
            }
        } catch {
            Write-ErrorMsg "Failed to install pnpm automatically"
            Write-Host "Please install pnpm manually: npm install -g pnpm" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-ErrorMsg "npm not available for pnpm installation"
        Write-Host "Please install pnpm manually: https://pnpm.io/installation" -ForegroundColor Red
        exit 1
    }
}

# Check wget
Write-InfoMsg "Checking wget..."
# Check for actual wget.exe binary, not PowerShell alias
try {
    $wgetExe = Get-Command wget.exe -CommandType Application -ErrorAction Stop
    # Test if it's actually wget by checking version
    $testResult = & $wgetExe.Source --version 2>$null
    if ($testResult -match "GNU Wget") {
        Write-Success "wget is available"
    } else {
        throw "Not real wget"
    }
} catch {
    Write-ErrorMsg "wget not found"
    Write-ProgressMsg "Attempting to install wget..."
    Write-Host "wget is required for downloading ceremony files" -ForegroundColor Cyan
    Write-Host "Installing wget (this may take a few minutes)..." -ForegroundColor Cyan
    
    $installed = Install-Package -PackageName "wget" -WingetId "JernejSimoncic.Wget" -ChocoName "wget" -FallbackUrl "https://eternallybored.org/misc/wget/"
    if ($installed) {
        # Refresh PATH
        Refresh-Path
        Write-InfoMsg "Verifying wget installation and PATH configuration..."
        
        try {
            $wgetExe = Get-Command wget.exe -CommandType Application -ErrorAction Stop
            $testResult = & $wgetExe.Source --version 2>$null
            if ($testResult -match "GNU Wget") {
                Write-Success "wget installed successfully and available in PATH"
            } else {
                throw "Installation verification failed"
            }
        } catch {
            # wget not found in PATH, try to locate and add it
            Write-WarningMsg "wget installed but not found in PATH, attempting to fix..."
            
            # Common wget installation paths
            $commonPaths = @(
                "${env:ProgramFiles}\GnuWin32\bin",
                "${env:ProgramFiles(x86)}\GnuWin32\bin",
                "${env:ProgramFiles}\wget\bin",
                "${env:LOCALAPPDATA}\Microsoft\WinGet\Packages\JernejSimoncic.Wget_Microsoft.Winget.Source_8wekyb3d8bbwe",
                "$env:ChocolateyInstall\bin"
            )
            
            $wgetFound = $false
            foreach ($path in $commonPaths) {
                $wgetPath = Join-Path $path "wget.exe"
                if (Test-Path $wgetPath) {
                    Write-InfoMsg "Found wget at: $path"
                    
                    # Add to current session PATH
                    if ($env:PATH -notlike "*$path*") {
                        $env:PATH = $env:PATH + ";" + $path
                        Write-Success "Added $path to current session PATH"
                    }
                    
                    # Test wget again
                    try {
                        $testResult = & $wgetPath --version 2>$null
                        if ($testResult -match "GNU Wget") {
                            Write-Success "wget is now working correctly"
                            $wgetFound = $true
                            
                            # Add to permanent user PATH
                            $userPath = [Environment]::GetEnvironmentVariable("PATH", "User")
                            if ($userPath -notlike "*$path*") {
                                $newUserPath = $userPath + ";" + $path
                                [Environment]::SetEnvironmentVariable("PATH", $newUserPath, "User")
                                Write-Success "Added wget to permanent user PATH"
                            }
                            break
                        }
                    } catch {
                        continue
                    }
                }
            }
            
            if (-not $wgetFound) {
                Write-ErrorMsg "wget installation verification failed"
                Write-Host "wget is required for downloading ceremony files" -ForegroundColor Red
                Write-Host "Please install wget manually from: https://eternallybored.org/misc/wget/" -ForegroundColor Red
                Write-Host "And ensure it's added to your PATH environment variable" -ForegroundColor Red
                exit 1
            }
        }
    } else {
        Write-ErrorMsg "Failed to install wget automatically"
        Write-Host "wget is required for downloading ceremony files" -ForegroundColor Red
        Write-Host "Please install wget manually from: https://eternallybored.org/misc/wget/" -ForegroundColor Red
        exit 1
    }
}

# Check curl
Write-InfoMsg "Checking curl..."
if (Test-Command "curl") {
    Write-Success "curl is available"
} else {
    Write-ErrorMsg "curl not found"
    Write-ProgressMsg "Attempting to install curl..."
    
    $installed = Install-Package -PackageName "curl" -WingetId "curl.curl" -ChocoName "curl" -FallbackUrl "https://curl.se/windows/"
    if ($installed) {
        # Refresh PATH
        Refresh-Path
        if (Test-Command "curl") {
            Write-Success "curl installed successfully"
        }
    } else {
        Write-ErrorMsg "Failed to install curl automatically"
        Write-Host "curl is required for uploading ceremony files" -ForegroundColor Red
        Write-Host "Please install curl manually from: https://curl.se/windows/" -ForegroundColor Red
        exit 1
    }
}

# Check snarkjs
Write-InfoMsg "Checking snarkjs..."
if (Test-Command "snarkjs") {
    try {
        $snarkjsVersion = (snarkjs --version 2>$null | Select-Object -First 1).Split(' ')[1]
        if (-not $snarkjsVersion) { $snarkjsVersion = "unknown" }
        Write-Success "snarkjs $snarkjsVersion is available"
    } catch {
        Write-Success "snarkjs is available"
    }
} else {
    Write-ErrorMsg "snarkjs not found"
    
    if ((Test-Command "npm") -or (Test-Command "pnpm")) {
        Write-ProgressMsg "Attempting to install snarkjs..."
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
                Write-ErrorMsg "snarkjs installation verification failed"
                exit 1
            }
        } catch {
            Write-ErrorMsg "Failed to install snarkjs automatically"
            Write-Host "snarkjs is required for Powers of Tau ceremony operations" -ForegroundColor Red
            Write-Host "Install snarkjs manually: npm install -g snarkjs" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-ErrorMsg "npm/pnpm not available for snarkjs installation"
        Write-Host "Please install snarkjs manually: npm install -g snarkjs" -ForegroundColor Red
        exit 1
    }
}

# Check and configure pnpm global bin directory
Write-InfoMsg "Checking pnpm global configuration..."
try {
    $pnpmGlobalBin = pnpm config get global-bin-dir 2>$null
    $recommendedBinDir = "$env:USERPROFILE\.local\bin"
    
    if (-not $pnpmGlobalBin -or $pnpmGlobalBin -eq "undefined") {
        Write-WarningMsg "pnpm global-bin-dir not configured"
        Write-ProgressMsg "Setting up global bin directory: $recommendedBinDir"
        
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
            Write-ErrorMsg "Failed to configure pnpm global-bin-dir"
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
        Write-WarningMsg "Global bin directory not in PATH"
        Write-ProgressMsg "Adding global bin directory to PATH for this session..."
        
        # Add to current session PATH
        $env:PATH = $env:PATH + ";" + $pnpmGlobalBin
        Write-Success "Added $pnpmGlobalBin to PATH for this session"
        
        Write-Host "Note: You may need to add this to your permanent PATH:" -ForegroundColor Yellow
        Write-Host "  $pnpmGlobalBin" -ForegroundColor Yellow
    }
} catch {
    Write-WarningMsg "Could not configure pnpm global settings"
}

Write-Host ""
Write-ProgressMsg "Installing dependencies..."

# Install dependencies
try {
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Write-ErrorMsg "Dependency installation failed!"
        exit 1
    }
} catch {
    Write-ErrorMsg "Dependency installation failed!"
    exit 1
}

Write-Host ""
Write-ProgressMsg "Building Brebaje CLI..."

# Build the CLI
try {
    pnpm build
    if ($LASTEXITCODE -ne 0) {
        Write-ErrorMsg "Build failed!"
        exit 1
    }
} catch {
    Write-ErrorMsg "Build failed!"
    exit 1
}

Write-ProgressMsg "Installing Brebaje CLI globally..."

# Install globally
try {
    pnpm link --global
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Installation successful!"
        Write-Host ""
        
        # Verify CLI is accessible
        Write-InfoMsg "Verifying CLI accessibility..."
        
        # Refresh PATH multiple times to ensure we get the latest
        Refresh-Path
        Start-Sleep -Seconds 1
        
        # Also add the pnpm global bin to current session if not already there
        $pnpmGlobalBin = pnpm config get global-bin-dir 2>$null
        if ($pnpmGlobalBin -and $env:PATH -notlike "*$pnpmGlobalBin*") {
            $env:PATH = $env:PATH + ";" + $pnpmGlobalBin
            Write-InfoMsg "Added pnpm global bin to current session PATH"
        }
        
        if (Test-Command "brebaje-cli") {
            Write-Success "brebaje-cli is accessible in PATH"
            Write-Host ""
            Write-Host "Installation completed successfully!" -ForegroundColor Green
            Write-Host ""
            brebaje-cli --help
        } else {
            Write-WarningMsg "brebaje-cli not found in PATH"
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
        Write-ErrorMsg "Installation failed!"
        exit 1
    }
} catch {
    Write-ErrorMsg "Installation failed!"
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