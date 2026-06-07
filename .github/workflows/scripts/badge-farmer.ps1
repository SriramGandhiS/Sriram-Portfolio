# ============================================================
#  Badge Farmer - Full GitHub Achievement Automation (Cloud Edition)
#  Targets  : Pull Shark, YOLO, Quickdraw, Pair Extraordinaire
#  Author   : SriramGandhiS
#  Schedule : Runs daily via GitHub Actions
# ============================================================

# MAIN ACCOUNT - SriramGandhiS (merges PRs, earns all badges)
$MAIN_TOKEN = [System.Environment]::GetEnvironmentVariable("MAIN_TOKEN")
if ([string]::IsNullOrEmpty($MAIN_TOKEN)) {
    Write-Host "ERROR: MAIN_TOKEN env variable is empty."
    exit 1
}
$MAIN_OWNER = "SriramGandhiS"

# SECONDARY ACCOUNT - rizz-architect (opens PRs via fork)
$BOT_TOKEN  = [System.Environment]::GetEnvironmentVariable("BOT_TOKEN")
if ([string]::IsNullOrEmpty($BOT_TOKEN)) {
    Write-Host "ERROR: BOT_TOKEN env variable is empty."
    exit 1
}
$BOT_OWNER  = "rizz-architect"

$LOG_FILE   = [System.IO.Path]::Combine($PSScriptRoot, "badge-farmer.log")
$STATE_FILE = [System.IO.Path]::Combine($PSScriptRoot, "badge_done_today.txt")

# Co-author line — rizz-architect co-authors main account commits for Pair Extraordinaire
$CO_AUTHOR  = "rizz-architect <srirams23cs@psnacet.edu.in>"

$PROJECTS = @(
    @{ Name = "Hiresense";  Repo = "Hiresense.ai";             Path = "D:\Hiresense";       Branch = "main" },
    @{ Name = "SmartSlate"; Repo = "SmartSlate";               Path = "D:\SmartSlate";      Branch = "main" },
    @{ Name = "Javino";     Repo = "Javino-AI-Authenticity";   Path = "D:\Ai java project"; Branch = "main" },
    @{ Name = "ROI";        Repo = "ROI-THE-LEGAL-APP";        Path = "D:\ROICONSI-main";   Branch = "main" }
)

$DOC_FILES = @("TODO.md", "BUGS.md", "dev-notes.md", "future-updates.md")

$PR_TITLES = @(
    "docs: update development planning notes",
    "docs: refine task tracking checklist",
    "docs: minor cleanup of sprint notes",
    "docs: add implementation detail notes",
    "docs: revise architecture decision log",
    "docs: update roadmap planning document",
    "docs: tidy up feature planning outline",
    "docs: refresh project documentation notes"
)

$ISSUE_TITLES = @(
    "chore: routine codebase health check",
    "chore: verify environment configuration",
    "chore: dependency audit review",
    "chore: quick documentation review",
    "chore: performance baseline checkpoint"
)

# ================================================================
# HELPERS
# ================================================================

function Log {
    param([string]$msg)
    $ts   = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $line = "[$ts] $msg"
    try { Add-Content -Path $LOG_FILE -Value $line -Encoding UTF8 -ErrorAction SilentlyContinue } catch {}
    Write-Host $line
}

function Get-TodayKey { (Get-Date -Format "yyyy-MM-dd") }
function Is-DoneToday {
    if (-not (Test-Path $STATE_FILE)) { return $false }
    return ((Get-Content $STATE_FILE -Raw -ErrorAction SilentlyContinue).Trim() -eq (Get-TodayKey))
}
function Mark-DoneToday { (Get-TodayKey) | Out-File $STATE_FILE -Encoding UTF8 }

function GH-API {
    param([string]$Token, [string]$Method, [string]$Endpoint, [object]$Body = $null)
    $headers = @{
        "Authorization"        = "token $Token"
        "Accept"               = "application/vnd.github+json"
        "X-GitHub-Api-Version" = "2022-11-28"
        "User-Agent"           = "badge-farmer-cloud/2.0"
    }
    $uri = "https://api.github.com$Endpoint"
    try {
        if ($Body) {
            return Invoke-RestMethod -Uri $uri -Method $Method -Headers $headers `
                   -Body ($Body | ConvertTo-Json -Depth 10 -Compress) `
                   -ContentType "application/json" -ErrorAction Stop
        } else {
            return Invoke-RestMethod -Uri $uri -Method $Method -Headers $headers -ErrorAction Stop
        }
    } catch {
        $errBody = ""
        try {
            $reader  = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
            $errBody = $reader.ReadToEnd()
        } catch {}
        Log "API ERROR [$Method $Endpoint]: $($_.Exception.Message) | $errBody"
        return $null
    }
}

# ================================================================
# STEP 1: Ensure rizz-architect has a fork of the repo
# ================================================================
function Ensure-Fork {
    param([string]$repo)

    # Check if fork already exists
    $fork = GH-API $BOT_TOKEN "GET" "/repos/$BOT_OWNER/$repo"
    if ($fork -and $fork.name) {
        Log "[Fork] $BOT_OWNER/$repo already exists"
        return $fork
    }

    # Create the fork from the main account's repo
    Log "[Fork] Creating fork: $BOT_OWNER/$repo from $MAIN_OWNER/$repo"
    $newFork = GH-API $BOT_TOKEN "POST" "/repos/$MAIN_OWNER/$repo/forks" @{ default_branch_only = $true }
    if (-not $newFork) {
        Log "[Fork] Fork creation failed for $repo"
        return $null
    }

    # Wait for fork to be ready
    Start-Sleep -Seconds 10
    Log "[Fork] Fork created: $($newFork.full_name)"
    return $newFork
}

# ================================================================
# STEP 2: Sync the fork with upstream (so it's not behind)
# ================================================================
function Sync-Fork {
    param([string]$repo, [string]$branch)
    $syncResult = GH-API $BOT_TOKEN "POST" "/repos/$BOT_OWNER/$repo/merge-upstream" @{ branch = $branch }
    if ($syncResult) {
        Log "[Sync] $BOT_OWNER/$repo synced with upstream ($($syncResult.merge_type))"
    }
}

# ================================================================
# STEP 3: Push a commit to a new branch in the fork via GitHub API
# ================================================================
function Push-BotCommit {
    param([string]$repo, [string]$branch, [string]$prBranch, [string]$prTitle)

    # Get the SHA of the latest commit on the base branch in the FORK
    $branchInfo = GH-API $BOT_TOKEN "GET" "/repos/$BOT_OWNER/$repo/branches/$branch"
    if (-not $branchInfo) {
        Log "[BotCommit] Could not get branch info for $BOT_OWNER/$repo/$branch"
        return $false
    }
    $baseSha = $branchInfo.commit.sha
    Log "[BotCommit] Base SHA: $baseSha"

    # Create the new branch in the fork
    $createBranch = GH-API $BOT_TOKEN "POST" "/repos/$BOT_OWNER/$repo/git/refs" @{
        ref = "refs/heads/$prBranch"
        sha = $baseSha
    }
    if (-not $createBranch) {
        $existing = GH-API $BOT_TOKEN "GET" "/repos/$BOT_OWNER/$repo/git/refs/heads/$prBranch"
        if (-not $existing) {
            Log "[BotCommit] Failed to create branch $prBranch"
            return $false
        }
    }
    Log "[BotCommit] Branch created: $prBranch"

    # Create a completely new file with a unique name to avoid SHA update conflicts
    $uniqueId    = Get-Date -Format "yyyyMMddHHmmss"
    $docFile     = "docs/update-$uniqueId.md"
    
    $timestamp   = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $newContent  = "# Developer Notes`n`nProject development notes and planning.`n`n<!-- updated: $timestamp -->`n"
    $encoded     = [System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($newContent))

    # Commit message with Co-authored-by (Pair Extraordinaire)
    $commitMsg   = "$prTitle`n`nCo-authored-by: $CO_AUTHOR"

    # Create the file commit (since it's a new file, no sha is needed)
    $commitPayload = @{
        message = $commitMsg
        content = $encoded
        branch  = $prBranch
    }

    $commitResult = GH-API $BOT_TOKEN "PUT" "/repos/$BOT_OWNER/$repo/contents/$docFile" $commitPayload
    if (-not $commitResult) {
        Log "[BotCommit] File commit failed for $docFile"
        return $false
    }
    Log "[BotCommit] Committed new file $docFile to $prBranch"
    return $true
}

# ================================================================
# MAIN BADGE LOGIC: Pull Shark + YOLO + Pair Extraordinaire
# ================================================================
function Do-PullShark {
    param($project)

    $name   = $project.Name
    $repo   = $project.Repo
    $branch = $project.Branch

    Log "[$name] Starting Pull Shark: $BOT_OWNER -> $MAIN_OWNER/$repo"

    # 1. Ensure fork exists
    $fork = Ensure-Fork $repo
    if (-not $fork) { return $false }

    # 2. Sync fork with upstream
    Sync-Fork $repo $branch

    # 3. Push a commit to a new branch in the fork
    $stamp    = Get-Date -Format "yyyyMMdd-HHmm"
    $prBranch = "patch-$stamp"
    $prTitle  = $PR_TITLES | Get-Random

    $committed = Push-BotCommit $repo $branch $prBranch $prTitle
    if (-not $committed) {
        Log "[$name] Bot commit failed"
        return $false
    }

    # 4. Open PR from fork to main repo (as rizz-architect, targeting SriramGandhiS)
    Start-Sleep -Seconds 3
    $prPayload = @{
        title = $prTitle
        head  = "$BOT_OWNER`:$prBranch"   # fork:branch format
        base  = $branch
        body  = "Automated documentation maintenance update.`n`nRoutine project notes cleanup by contributor."
        draft = $false
    }
    $pr = GH-API $BOT_TOKEN "POST" "/repos/$MAIN_OWNER/$repo/pulls" $prPayload
    if (-not $pr -or -not $pr.number) {
        Log "[$name] PR creation failed"
        GH-API $BOT_TOKEN "DELETE" "/repos/$BOT_OWNER/$repo/git/refs/heads/$prBranch" | Out-Null
        return $false
    }
    $prNum = $pr.number
    Log "[$name] PR #$prNum opened by $BOT_OWNER -> $MAIN_OWNER/$repo"

    # 5. Merge PR as MAIN account (NO review requested = YOLO badge)
    Start-Sleep -Seconds 5
    $mergePayload = @{
        commit_title   = "docs: merge patch from contributor (#$prNum)"
        commit_message = "Automated documentation contribution merged."
        merge_method   = "squash"
    }
    $merged = GH-API $MAIN_TOKEN "PUT" "/repos/$MAIN_OWNER/$repo/pulls/$prNum/merge" $mergePayload
    if ($merged -and $merged.merged -eq $true) {
        Log "[$name] PR #$prNum MERGED by $MAIN_OWNER -- Pull Shark + YOLO + Pair Extraordinaire EARNED!"
    } else {
        # Retry once
        Start-Sleep -Seconds 8
        $merged = GH-API $MAIN_TOKEN "PUT" "/repos/$MAIN_OWNER/$repo/pulls/$prNum/merge" $mergePayload
        if ($merged -and $merged.merged -eq $true) {
            Log "[$name] PR #$prNum MERGED on retry"
        } else {
            Log "[$name] PR #$prNum merge failed - may need manual merge"
            return $false
        }
    }

    # 6. Cleanup: delete branch in fork
    Start-Sleep -Seconds 2
    GH-API $BOT_TOKEN "DELETE" "/repos/$BOT_OWNER/$repo/git/refs/heads/$prBranch" | Out-Null

    return $true
}

# ================================================================
# QUICKDRAW: Open + close issue in under 5 minutes
# ================================================================
function Do-Quickdraw {
    param([string]$repo)

    $title = ($ISSUE_TITLES | Get-Random)
    $issue = GH-API $MAIN_TOKEN "POST" "/repos/$MAIN_OWNER/$repo/issues" @{
        title = "$title - $(Get-Date -Format 'MMM dd yyyy')"
        body  = "Routine automated health check. Verified and closing immediately."
    }
    if (-not $issue -or -not $issue.number) {
        Log "[Quickdraw] Issue creation failed for $repo"
        return $false
    }
    $issueNum = $issue.number
    Log "[Quickdraw] Issue #$issueNum created"

    Start-Sleep -Seconds 2

    $closed = GH-API $MAIN_TOKEN "PATCH" "/repos/$MAIN_OWNER/$repo/issues/$issueNum" @{
        state        = "closed"
        state_reason = "completed"
    }
    if ($closed -and $closed.state -eq "closed") {
        Log "[Quickdraw] Issue #$issueNum CLOSED -- Quickdraw EARNED!"
        return $true
    }
    return $false
}

# ================================================================
# TOKEN VALIDATION
# ================================================================
function Test-Tokens {
    $main = GH-API $MAIN_TOKEN "GET" "/user"
    $bot  = GH-API $BOT_TOKEN  "GET" "/user"
    $ok   = $true
    if ($main -and $main.login) { Log "Main token OK: $($main.login)" } else { Log "ERROR: MAIN token invalid!"; $ok = $false }
    if ($bot  -and $bot.login)  { Log "Bot token OK:  $($bot.login)"  } else { Log "ERROR: BOT token invalid!";  $ok = $false }
    return $ok
}

# ================================================================
# MAIN
# ================================================================
$isGitHubActions = -not [string]::IsNullOrEmpty([System.Environment]::GetEnvironmentVariable("GITHUB_ACTIONS"))
if (Is-DoneToday -and -not $isGitHubActions) {
    Log "Badge farmer already completed today. Exiting."
    exit 0
}

Log "============================================================"
Log " Badge Farmer (Cloud Edition) Started"
Log " Main: $MAIN_OWNER | Bot: $BOT_OWNER"
Log " Targets: Pull Shark + YOLO + Quickdraw + Pair Extraordinaire"
Log "============================================================"

if (-not (Test-Tokens)) {
    Log "ABORT: Token validation failed."
    exit 1
}

$totalPRs      = 0
$quickdrawDone = $false

# Shuffle project order
$shuffled = $PROJECTS | Sort-Object { Get-Random }

foreach ($project in $shuffled) {
    Log "--- Processing: $($project.Name) ---"

    # Pull Shark + YOLO + Pair Extraordinaire
    $ok = Do-PullShark $project
    if ($ok) { $totalPRs++ }

    # Quickdraw on first successful repo
    if (-not $quickdrawDone) {
        $qdOk = Do-Quickdraw $project.Repo
        if ($qdOk) { $quickdrawDone = $true }
    }

    $pause = Get-Random -Minimum 10 -Maximum 25
    Log "Pausing $pause seconds..."
    Start-Sleep -Seconds $pause
}

Log "============================================================"
Log " Badge Farmer DONE"
Log " PRs Merged (Pull Shark): $totalPRs"
Log " YOLO (no review merges): $totalPRs"
Log " Quickdraw earned       : $quickdrawDone"
Log " Pair Extraordinaire    : Embedded in every PR commit"
Log "============================================================"

Mark-DoneToday
exit 0
