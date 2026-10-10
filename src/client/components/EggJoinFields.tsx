import { Input, Label, Select, type FormExtension } from '@pterodactyl/sdk';
import { JOIN_TYPES } from '../api';

type Values = { type: string | null; template: string | null };

/** "How players join" on the admin egg form. */
const EggJoinFields: FormExtension<Values> = ({ field, values }) => {
    const type = field('type');
    const template = field('template');

    return (
        <div className='rxcb:flex rxcb:flex-col rxcb:gap-4'>
            <div>
                <Label htmlFor={type.id}>How players join</Label>
                <Select id={type.id} value={type.value ?? 'auto'} options={JOIN_TYPES} onChange={(v) => type.setValue(String(v))} />
                {type.error && <p className='input-help error'>{type.error}</p>}
            </div>
            {values.type === 'custom' && (
                <div>
                    <Label htmlFor={template.id}>Join link</Label>
                    <Input
                        id={template.id}
                        value={template.value ?? ''}
                        placeholder='steam://connect/{ip}:{port}'
                        onChange={(e) => template.setValue(e.target.value)}
                    />
                    <p className='rxcb:mt-1 rxcb:text-xs rxcb:text-muted-foreground'>
                        Use {'{ip}'} and {'{port}'} for the server's main address.
                    </p>
                    {template.error && <p className='input-help error'>{template.error}</p>}
                </div>
            )}
        </div>
    );
};

export default EggJoinFields;
