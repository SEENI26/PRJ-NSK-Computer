<?php
/**
 * The registry of editable page sections.
 *
 * This is the allow-list that makes the section editor safe. The existing
 * settings endpoints refuse any key they do not name explicitly, for the good
 * reason that an arbitrary key lets the panel write rows nothing reads — the
 * same discipline applies here, just with more keys.
 *
 * It lives in PHP rather than in the admin UI because validation has to happen
 * where it cannot be skipped. The panel fetches this list to build its form, so
 * the two can never disagree about what is editable.
 *
 * Storage reuses the `settings` table: one row per section, named
 * `section:<page>.<id>`, holding a small JSON object. No migration needed, and
 * a section with no row simply falls back to what is compiled into the site.
 */

declare(strict_types=1);

const SECTION_PREFIX = 'section:';

/** Field types the editor understands, with their limits. */
const SECTION_FIELDS = [
    'eyebrow' => ['label' => 'Eyebrow',   'type' => 'text',  'max' => 60],
    'heading' => ['label' => 'Heading',   'type' => 'text',  'max' => 120],
    'lead'    => ['label' => 'Lead text', 'type' => 'blob',  'max' => 600],
    'image'   => ['label' => 'Image',     'type' => 'image', 'max' => 300],
];

/**
 * Every section the panel may edit, grouped by the page it appears on.
 * `fields` names which of SECTION_FIELDS apply — not every section has an image.
 */
function section_registry(): array
{
    $copy      = ['eyebrow', 'heading', 'lead'];
    $withImage = ['eyebrow', 'heading', 'lead', 'image'];

    return [
        'home' => [
            'label'    => 'Home',
            'sections' => [
                'hero'        => ['label' => 'Hero',                 'fields' => $withImage],
                'oneRoof'     => ['label' => 'Six departments',      'fields' => $copy],
                'gamingVsPro' => ['label' => 'Gaming vs Professional','fields' => $copy],
                'featured'    => ['label' => 'Featured builds',      'fields' => $copy],
                'hardware'    => ['label' => 'Hardware categories',  'fields' => $copy],
                'accessories' => ['label' => 'Accessories preview',  'fields' => $copy],
                'whyUs'       => ['label' => 'Why people come back', 'fields' => $copy],
                'showroom'    => ['label' => 'Showroom gallery',     'fields' => $withImage],
                'cta'         => ['label' => 'Closing call to action','fields' => $copy],
            ],
        ],
        'gaming' => [
            'label'    => 'Gaming PCs',
            'sections' => [
                'hero'        => ['label' => 'Hero',            'fields' => $withImage],
                'rigs'        => ['label' => 'Four tiers',      'fields' => $copy],
                'laptops'     => ['label' => 'Gaming laptops',  'fields' => $copy],
                'cabinets'    => ['label' => 'Cabinets',        'fields' => $copy],
                'accessories' => ['label' => 'Gaming gear',     'fields' => $copy],
            ],
        ],
        'professional' => [
            'label'    => 'Professional PCs',
            'sections' => [
                'hero'        => ['label' => 'Hero',              'fields' => $withImage],
                'roles'       => ['label' => 'Start from the work','fields' => $copy],
                'catalogue'   => ['label' => 'The range',         'fields' => $copy],
                'builds'      => ['label' => 'Built here',        'fields' => $copy],
                'accessories' => ['label' => 'Finish the desk',   'fields' => $copy],
                'cta'         => ['label' => 'Closing',           'fields' => $copy],
            ],
        ],
        'hardware' => [
            'label'    => 'Hardware',
            'sections' => [
                'hero'      => ['label' => 'Hero',      'fields' => $withImage],
                'catalogue' => ['label' => 'Catalogue', 'fields' => $copy],
            ],
        ],
        'accessories' => [
            'label'    => 'Accessories',
            'sections' => [
                'hero'      => ['label' => 'Hero',            'fields' => $withImage],
                'catalogue' => ['label' => 'Catalogue',       'fields' => $copy],
                'counter'   => ['label' => 'Try at the counter','fields' => $copy],
            ],
        ],
        'services' => [
            'label'    => 'Services',
            'sections' => [
                'hero'    => ['label' => 'Hero',           'fields' => $withImage],
                'jobs'    => ['label' => 'What we handle', 'fields' => $copy],
                'process' => ['label' => 'How a job runs', 'fields' => $copy],
                'cta'     => ['label' => 'Closing',        'fields' => $copy],
            ],
        ],
        'about' => [
            'label'    => 'About & Contact',
            'sections' => [
                'hero'    => ['label' => 'Hero',              'fields' => $withImage],
                'brands'  => ['label' => 'Supplied & serviced','fields' => $copy],
                'howWeWork' => ['label' => 'How we work',     'fields' => $copy],
                'visit'   => ['label' => 'Find the counter',  'fields' => $copy],
                'contact' => ['label' => 'Enquiry form',      'fields' => $copy],
            ],
        ],
    ];
}

/** Flat map of "page.section" => allowed field names. */
function section_keys(): array
{
    $flat = [];
    foreach (section_registry() as $page => $meta) {
        foreach ($meta['sections'] as $id => $section) {
            $flat["$page.$id"] = $section['fields'];
        }
    }
    return $flat;
}

/**
 * Reject anything not in the registry, trim to the field's limit, and drop
 * empties so a cleared field falls back to the compiled copy rather than
 * blanking the section on the live site.
 */
function section_sanitise(string $key, array $incoming): array
{
    $allowed = section_keys()[$key] ?? null;
    if ($allowed === null) {
        return [];
    }

    $clean = [];
    foreach ($allowed as $field) {
        if (!array_key_exists($field, $incoming)) {
            continue;
        }
        $value = $incoming[$field];
        if (!is_string($value)) {
            continue;
        }
        $value = trim($value);
        if ($value === '') {
            continue;
        }
        $clean[$field] = mb_substr($value, 0, SECTION_FIELDS[$field]['max']);
    }

    return $clean;
}
