# Backyard Klocka

En modern webbapplikation för att hantera och övervaka Backyard Ultra och Frontyard Ultra tävlingar. Byggd med Next.js 14, Supabase och Clerk för en säker och skalbar upplevelse.

## Funktioner

- 🏃‍♂️ Skapa och hantera Backyard Ultra och Frontyard Ultra tävlingar
- ⏱️ Stöd för både Backyard (fast intervall) och Frontyard (minskande intervall) format
- 📊 Realtidsövervakning av tävlingsstatus
- 👥 Användarhantering med säker autentisering
- 📱 Responsiv design för alla enheter
- 🌐 Stöd för svenska språket

## Teknisk Stack

- **Frontend**: Next.js 14 med App Router
- **Styling**: Tailwind CSS
- **Autentisering**: Clerk
- **Databas**: Supabase (PostgreSQL)
- **Språk**: TypeScript
- **Formatering**: Prettier
- **Linting**: ESLint

## Installation

1. Klona projektet:
   ```bash
   git clone https://github.com/yourusername/backyard-klocka.git
   cd backyard-klocka
   ```

2. Installera beroenden:
   ```bash
   npm install
   ```

3. Skapa en `.env.local` fil med följande variabler:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. Starta utvecklingsservern:
   ```bash
   npm run dev
   ```

## Databasstruktur

Projektet använder följande tabeller i Supabase:

### races
- `id`: UUID (primärnyckel)
- `user_id`: UUID (främmande nyckel till Clerk users)
- `name`: text
- `type`: enum ('backyard', 'frontyard')
- `status`: enum ('not_started', 'in_progress', 'completed')
- `lap_distance`: integer
- `interval_time`: integer
- `lap_reduction`: integer
- `created_at`: timestamp
- `updated_at`: timestamp

## Användning

1. **Skapa en tävling**
   - Navigera till dashboard
   - Klicka på "Skapa ny tävling"
   - Fyll i tävlingsinformation
   - Välj mellan Backyard eller Frontyard format

2. **Hantera tävling**
   - Se tävlingsinformation
   - Starta/stoppa tävling
   - Redigera tävlingsinställningar
   - Ta bort tävling

## Utveckling

Projektet följer följande kodstandarder:
- TypeScript för typsäkerhet
- ESLint för kodkvalitet
- Prettier för kodformatering
- Komponentbaserad arkitektur
- Server Actions för datahantering

## Bidra

1. Forka projektet
2. Skapa en feature branch (`git checkout -b feature/amazing-feature`)
3. Committa dina ändringar (`git commit -m 'Add some amazing feature'`)
4. Pusha till branchen (`git push origin feature/amazing-feature`)
5. Öppna en Pull Request

## Licens

Detta projekt är licensierat under MIT-licensen - se [LICENSE](LICENSE) filen för detaljer.

## Kontakt

Ditt namn - [@dittwitter](https://twitter.com/dittwitter)

Projektlänk: [https://github.com/yourusername/backyard-klocka](https://github.com/yourusername/backyard-klocka)
