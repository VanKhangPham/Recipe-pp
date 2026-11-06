param(
    [string]$Path = (Join-Path $PSScriptRoot '../../data/samples/vietnamese_recipes.sample.json')
)

$ErrorActionPreference = 'Stop'
$json = Get-Content -LiteralPath $Path -Raw -Encoding UTF8
if (!$json.TrimStart().StartsWith('[')) { throw 'Expected a JSON array of recipes.' }
# Assign before iterating: Windows PowerShell 5.1 emits the JSON array as one pipeline object.
$recipes = ConvertFrom-Json -InputObject $json
if (!$recipes.Count) { throw 'Dataset is empty.' }
$keys = @{}
$titles = @{}
$issues = @()
$units = @('g','kg','ml','l','tsp','tbsp','piece')
foreach ($recipe in $recipes) {
    $key = [string]$recipe.datasetKey
    $title = ([string]$recipe.title).Trim().Normalize()
    if ($key -cnotmatch '^[a-z0-9]+(-[a-z0-9]+)*$' -or $keys.ContainsKey($key)) { $issues += "Invalid or duplicate datasetKey: $key" }
    if (!$title -or $titles.ContainsKey($title)) { $issues += "Invalid or duplicate title: $key" }
    $keys[$key] = $true
    $titles[$title] = $true
    if ($recipe.status -cne 'Draft' -or !$recipe.source.type -or $recipe.source.review -cne 'pending' -or
        $recipe.source.publicationAllowed -isnot [bool] -or $recipe.source.publicationAllowed) {
        $issues += "Expected pending source and unpublished draft: $key"
    }
    if ($recipe.servings -lt 1 -or $recipe.servings -gt 100 -or !$recipe.category) { $issues += "Invalid servings or category: $key" }
    if ($null -ne $recipe.description -and ([string]::IsNullOrWhiteSpace($recipe.description) -or $recipe.description.Length -gt 2000)) {
        $issues += "Invalid description: $key"
    }
    if ($recipe.ingredients -isnot [array] -or !$recipe.ingredients.Count) { $issues += "Missing ingredients: $key" }
    $recipeIngredients = @{}
    foreach ($item in $recipe.ingredients) {
        if ([string]::IsNullOrWhiteSpace($item.name) -or $item.unit -cnotin $units -or
            $item.quantity -isnot [ValueType] -or $item.quantity -is [bool] -or
            $item.quantity -le 0 -or $item.quantity -gt 999999999.999 -or [decimal]::Round($item.quantity,3) -ne $item.quantity) {
            $issues += "Invalid ingredient name, quantity or unit: $key"
        } else {
            $normName = ($item.name.Trim().Normalize() -replace '\s+', ' ').ToLowerInvariant()
            if ($recipeIngredients.ContainsKey($normName)) { $issues += "Duplicate ingredient in recipe: $key ($normName)" }
            $recipeIngredients[$normName] = $true
        }
    }
    if ($recipe.steps -isnot [array] -or !$recipe.steps.Count) { $issues += "Missing steps: $key" }
    foreach ($step in $recipe.steps) {
        if ($step -isnot [string] -or [string]::IsNullOrWhiteSpace($step)) { $issues += "Invalid step: $key" }
    }
}
if ($issues.Count) { throw ($issues -join [Environment]::NewLine) }
Write-Output "Dry-run passed: $($recipes.Count) unique drafts. No database connection."
