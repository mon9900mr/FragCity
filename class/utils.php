<?php
class UtilsClass
{
    /** Resolve an item image only when the matching file exists in this repository. */
    private static function catalogImageUrl(string $image, array $roots): string
    {
        $image = trim(str_replace('\\\\', '/', $image));
        if ($image === '') return '';
        // Datasets normally contain filenames, but safely accept relative paths too.
        $image = basename($image);
        foreach ($roots as $root) {
            $root = trim(str_replace('\\\\', '/', $root), '/');
            if ($root === '') continue;
            if (is_file(__DIR__ . '/../' . $root . '/' . $image)) {
                return $root . '/' . rawurlencode($image);
            }
        }

        // Allow deployments that intentionally host catalog images on a remote CDN.
        foreach (['IMAGE_BASE_SKINS', 'IMAGE_BASE_AGENTS', 'IMAGE_BASE_WEAPONS'] as $constant) {
            if (!defined($constant)) continue;
            $base = (string)constant($constant);
            if (preg_match('#^(https?:)?//#i', $base)) return rtrim($base, '/') . '/' . rawurlencode($image);
            $local = trim($base, '/') . '/' . $image;
            if (is_file(__DIR__ . '/../' . $local)) return $local;
        }

        return '';
    }
    // ======================== اسکین‌ها ========================
    public static function skinsFromJson(): array
    {
        $file = __DIR__ . "/../data/" . SKIN_LANGUAGE . ".json";   // skins_en.json
        if (!file_exists($file)) return [];
        $json = json_decode(file_get_contents($file), true);
        $skins = [];
        foreach ($json as $skin) {
            $image = (string)($skin['image'] ?? '');
            $imageUrl = self::catalogImageUrl($image, ['img/skins', 'img/weapon']);
            // Do not put broken/missing thumbnails into the selectable catalog.
            if ($imageUrl === '') continue;

            $skins[(int) $skin['weapon_defindex']][(int) $skin['paint']] = [
                'weapon_name' => $skin['weapon_name'] ?? 'Unknown weapon',
                'paint_name'  => $skin['paint_name'] ?? 'Unknown skin',
                'image_url'   => $imageUrl,
            ];
        }
        return $skins;
    }

    public static function getWeaponsFromArray()
    {
        $weapons = [];
        $temp = self::skinsFromJson();
        foreach ($temp as $key => $value) {
            if (key_exists($key, $weapons)) continue;
            // A weapon may no longer have paint ID 0 after filtering missing images.
            $firstSkin = reset($value);
            if (!is_array($firstSkin)) continue;

            $weapons[$key] = [
                'weapon_name' => $firstSkin['weapon_name'],
                'paint_name'  => $firstSkin['paint_name'],
                'image_url'   => $firstSkin['image_url'],
            ];
        }
        return $weapons;
    }

    // ======================== چاقوها ========================
    public static function getKnifeTypes()
    {
        $knifes = [];
        $temp = self::getWeaponsFromArray();

        foreach ($temp as $key => $weapon) {
            if (!in_array($key, [500,503,505,506,507,508,509,512,514,515,516,517,518,519,520,521,522,523,525,526])) continue;
            $knifes[$key] = [
                'weapon_name' => $weapon['weapon_name'],
                'paint_name'  => rtrim(explode("|", $weapon['paint_name'])[0]),
                'image_url'   => $weapon['image_url'],
            ];
        }

        $knifes[0] = [
            'weapon_name' => "weapon_knife",
            'paint_name'  => "Default knife",
            'image_url'   => IMAGE_BASE_WEAPONS . "weapon_knife.png",
        ];

        ksort($knifes);
        return $knifes;
    }

    // ======================== دستکش‌ها (همه پینت‌ها) ========================
    public static function getGlovesAllPaints(): array
    {
        $file = __DIR__ . "/../data/gloves_en.json";
        if (!file_exists($file)) return [];
        $json = json_decode(file_get_contents($file), true);
        $gloves = [];
        foreach ($json as $item) {
            $defindex = $item['weapon_defindex'] ?? 0;
            $paint    = $item['paint'] ?? 0;
            $image    = (string)($item['image'] ?? '');
            $imageUrl = self::catalogImageUrl($image, ['img/skins', 'img/weapon']);

            // Keep only glove paints with a real thumbnail; the empty default is not an image.
            if ($imageUrl === '') continue;

            $gloves[$defindex][$paint] = [
                'name'      => $item['paint_name'] ?? 'Unknown',
                'image_url' => $imageUrl,
            ];
        }
        return $gloves;
    }

    // ======================== مأمورها ========================
    public static function getAgents(): array
    {
        $file = __DIR__ . "/../data/agents_en.json";
        if (!file_exists($file)) return ['t' => [], 'ct' => []];
        $json = json_decode(file_get_contents($file), true);
        $agents = ['t' => [], 'ct' => []];

        foreach ($json as $item) {
            $team  = (int)($item['team'] ?? 2);
            $model = $item['model'] ?? '';
            $name  = $item['agent_name'] ?? 'Unknown';
            $image = (string)($item['image'] ?? '');
            $imageUrl = self::catalogImageUrl($image, ['img/skins', 'img']);

            // The repo has some agent records without portraits; don't render broken cards.
            if ($imageUrl === '') continue;

            if ($team === 3) {
                $agents['ct'][$model] = [
                    'name'      => $name,
                    'image_url' => $imageUrl,
                ];
            } else {
                $agents['t'][$model] = [
                    'name'      => $name,
                    'image_url' => $imageUrl,
                ];
            }
        }
        return $agents;
    }

    // ======================== موسیقی ========================
    public static function getMusic(): array
    {
        $file = __DIR__ . "/../data/music_en.json";
        if (!file_exists($file)) return [];
        $json = json_decode(file_get_contents($file), true);
        $music = [];
        foreach ($json as $item) {
            $id   = $item['id'] ?? $item['music_id'] ?? null;
            $name = $item['name'] ?? $item['music_name'] ?? 'Unknown';
            if ($id === null) continue;
            $music[$id] = [
                'name'      => $name,
                'image_url' => IMAGE_BASE_SKINS . ($item['image'] ?? ''),
            ];
        }
        return $music;
    }

    // ======================== پین‌ها ========================
    public static function getPins(): array
    {
        $file = __DIR__ . "/../data/collectibles_en.json";
        if (!file_exists($file)) return [];
        $json = json_decode(file_get_contents($file), true);
        $pins = [];
        foreach ($json as $item) {
            $id   = $item['id'] ?? $item['pin_id'] ?? null;
            $name = $item['name'] ?? $item['pin_name'] ?? 'Unknown';
            if ($id === null) continue;
            $pins[$id] = [
                'name'      => $name,
                'image_url' => IMAGE_BASE_SKINS . ($item['image'] ?? ''),
            ];
        }
        return $pins;
    }

    // ======================== استیکرها ========================
    public static function getStickers(): array
    {
        $file = __DIR__ . "/../data/stickers_en.json";
        if (!file_exists($file)) return [];
        $json = json_decode(file_get_contents($file), true);
        $stickers = [];
        foreach ($json as $item) {
            $id   = $item['id'] ?? null;
            $name = $item['name'] ?? 'Unknown';
            if ($id === null) continue;
            $stickers[$id] = [
                'name'      => $name,
                'image_url' => IMAGE_BASE_SKINS . ($item['image'] ?? ''),
            ];
        }
        return $stickers;
    }

    // ======================== جاکلیدی‌ها ========================
    public static function getKeychains(): array
    {
        $file = __DIR__ . "/../data/keychains_en.json";
        if (!file_exists($file)) return [];
        $json = json_decode(file_get_contents($file), true);
        $keychains = [];
        foreach ($json as $item) {
            $id   = $item['id'] ?? null;
            $name = $item['name'] ?? 'Unknown';
            if ($id === null) continue;
            $keychains[$id] = [
                'name'      => $name,
                'image_url' => IMAGE_BASE_SKINS . ($item['image'] ?? ''),
            ];
        }
        return $keychains;
    }

    // ======================== ابزار کمکی ========================
    public static function getSelectedSkins(array $temp)
    {
        $selected = [];
        foreach ($temp as $weapon) {
            $selected[$weapon['weapon_defindex']] = [
                'weapon_paint_id' => $weapon['weapon_paint_id'],
                'weapon_seed'     => $weapon['weapon_seed'],
                'weapon_wear'     => $weapon['weapon_wear'],
            ];
        }
        return $selected;
    }

    public static function getWeaponCategory(int $defindex): string
{
    $pistols    = [1,2,3,4,30,32,36,61,63,64];
    $smgs       = [17,19,23,24,26,33,34];
    $rifles     = [7,8,9,10,11,13,16,38,39,40,60];
    $shotguns   = [25,27,29,35];
    $machineguns= [14,28];
    $knives     = [500,503,505,506,507,508,509,512,514,515,516,517,518,519,520,521,522,523,525,526];
    $zeus       = [31];

    if (in_array($defindex, $pistols)) return 'pistol';
    if (in_array($defindex, $smgs)) return 'smg';
    if (in_array($defindex, $rifles)) return 'rifle';
    if (in_array($defindex, $shotguns)) return 'shotgun';
    if (in_array($defindex, $machineguns)) return 'machinegun';
    if (in_array($defindex, $knives)) return 'knife';
    if (in_array($defindex, $zeus)) return 'zeus';
    return 'other';
}
}