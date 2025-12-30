/**
 * Worker pour html2md - Sert les assets statiques React
 * Le binding ASSETS gère automatiquement le serving des fichiers statiques
 */

export interface Env {
    ASSETS: {
        fetch(request: Request): Promise<Response>;
    };
}

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        // Toutes les requêtes sont gérées par le binding ASSETS
        // qui sert les fichiers depuis le dossier dist/
        return env.ASSETS.fetch(request);
    },
};
