<?php

namespace RustixDev\ConnectButtons\Fields;

use Closure;
use Illuminate\Validation\Rule;
use Pterodactyl\Extensions\Fields;
use RustixDev\ConnectButtons\Support\ConnectPresets;

/**
 * "How players join" on the admin egg form. The panel stores the values itself;
 * the provider reads them with settings()->fields($egg).
 */
final class EggConnectFields extends Fields
{
    public function rules(): array
    {
        return [
            'type' => ['nullable', Rule::in(ConnectPresets::TYPES)],
            'template' => ['nullable', 'string', 'max:300', 'required_if:type,custom', function (string $attribute, mixed $value, Closure $fail) {
                if (is_string($value) && $value !== '' && ! ConnectPresets::hasAllowedScheme($value)) {
                    $fail('The link must start with '.implode('://, ', ConnectPresets::SCHEMES).'://.');
                }
            }],
        ];
    }

    public function attributes(): array
    {
        return ['type' => 'join method', 'template' => 'join link'];
    }
}
