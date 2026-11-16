START TRANSACTION;
DO $guard$
BEGIN
    IF current_database() <> 'recipehub_dev' THEN
        RAISE EXCEPTION 'This script requires recipehub_dev.';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM public."__EFMigrationsHistory"
                   WHERE "MigrationId" = '20261104170933_AddPlanningSocialAndAdministration') THEN
        RAISE EXCEPTION 'Apply and verify the preceding migration first.';
    END IF;
END $guard$;
SET LOCAL search_path TO public;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261106071147_AddRecipeDatasetEntries') THEN
    CREATE TABLE "RecipeDatasetEntries" (
        "RecipeId" uuid NOT NULL,
        "DatasetKey" character varying(150) NOT NULL,
        "ContentHash" character varying(64) NOT NULL,
        "SourceType" character varying(100) NOT NULL,
        "SourceName" character varying(200),
        "SourceUrl" character varying(2048),
        "LicenseIdentifier" character varying(100),
        "ReviewStatus" character varying(20) NOT NULL,
        "ImportedAt" timestamp with time zone NOT NULL,
        CONSTRAINT "PK_RecipeDatasetEntries" PRIMARY KEY ("RecipeId"),
        CONSTRAINT "CK_Dataset_ReviewStatus" CHECK ("ReviewStatus" IN ('Pending','Approved','Rejected')),
        CONSTRAINT "FK_RecipeDatasetEntries_Recipes_RecipeId" FOREIGN KEY ("RecipeId") REFERENCES "Recipes" ("Id") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261106071147_AddRecipeDatasetEntries') THEN
    CREATE UNIQUE INDEX "IX_RecipeDatasetEntries_DatasetKey" ON "RecipeDatasetEntries" ("DatasetKey");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261106071147_AddRecipeDatasetEntries') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20261106071147_AddRecipeDatasetEntries', '10.0.13');
    END IF;
END $EF$;
COMMIT;

