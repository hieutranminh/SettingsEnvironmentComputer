# Build Environments

This project supports different build environments with specific configurations for development, staging, and production.

## Build Commands

### Development Build

```bash
pnpm run build:dev
```

- **Source Maps**: ✅ Enabled
- **Minification**: ❌ Disabled
- **Debug Mode**: ✅ Enabled
- **Environment**: `development`

### Staging Build

```bash
pnpm run build:staging
```

- **Source Maps**: ✅ Enabled
- **Minification**: ✅ Enabled (terser)
- **Debug Mode**: ❌ Disabled
- **Environment**: `staging`

### Production Build

```bash
pnpm run build:production
```

- **Source Maps**: ❌ Disabled
- **Minification**: ✅ Enabled (terser)
- **Debug Mode**: ❌ Disabled
- **Environment**: `production`

## Environment Variables

The build process uses environment-specific `.env` files:

- `.env.development` - Development environment settings
- `.env.staging` - Staging environment settings
- `.env.production` - Production environment settings

## Source Maps Configuration

Source maps are controlled at **build time**, not runtime:

- **Development**: Source maps enabled for debugging
- **Staging**: Source maps enabled for testing
- **Production**: Source maps disabled for security and performance

## Runtime vs Build Configuration

### Build Configuration (Vite)

- Controls how the code is compiled and bundled
- Determines source map generation
- Set at build time via environment variables
- Cannot be changed after deployment

### Runtime Configuration (useConfig)

- Controls application behavior at runtime
- Determines API endpoints, feature flags, etc.
- Can be changed without rebuilding
- Based on hostname or build environment

## Deployment Strategy

### For Development (aha-dev.vn)

```bash
pnpm run build:dev
```

This will create a build with source maps enabled, making debugging easier.

### For Staging (aha-stag.vn)

```bash
pnpm run build:staging
```

This will create a build with source maps enabled but optimized for testing.

### For Production (aha.vn)

```bash
pnpm run build:production
```

This will create a build without source maps for security and performance.

## Verification

To verify that source maps are working correctly:

1. **Build the application** with the appropriate command
2. **Deploy to the target environment**
3. **Open DevTools** in the browser
4. **Check the Sources tab** - you should see:
   - **Development/Staging**: Original source files with line numbers
   - **Production**: Minified code only

## Troubleshooting

### Source Maps Not Working

1. Ensure you're using the correct build command
2. Check that the environment variables are set correctly
3. Verify the deployment is using the correct build
4. Clear browser cache and reload

### Configuration Mismatch

1. Check that runtime config matches build environment
2. Verify hostname detection is working
3. Ensure environment variables are properly loaded

## Example Workflow

```bash
# For development deployment
pnpm run build:dev
# Deploy to aha-dev.vn

# For staging deployment
pnpm run build:staging
# Deploy to aha-stag.vn

# For production deployment
pnpm run build:production
# Deploy to aha.vn
```
