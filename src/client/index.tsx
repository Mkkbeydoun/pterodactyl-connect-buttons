import './styles.css';
import { definePterodactylExtension } from '@pterodactyl/sdk';
import ConnectBar from './components/ConnectBar';
import EggJoinFields from './components/EggJoinFields';

export default definePterodactylExtension({
    setup({ slots, forms }) {
        slots.register('server.console.before', ConnectBar);
        forms.extend('admin.egg', EggJoinFields);
    },
});
