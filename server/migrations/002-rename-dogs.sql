-- Stable IDs preserve profile URLs and existing adoption references.
-- Only names change; repeating these statements is harmless.
UPDATE dogs SET name = 'Demetrius' WHERE id = 'dog-8' AND name IS DISTINCT FROM 'Demetrius';
UPDATE dogs SET name = 'Casper' WHERE id = 'dog-24' AND name IS DISTINCT FROM 'Casper';
