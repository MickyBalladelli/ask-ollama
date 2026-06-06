import { Chip, Stack, Typography } from '@mui/material'

export default function ModelDetails({ model, modelInfo }) {
  if (!model) {
    return null
  }

  const details = modelInfo?.details ?? {}
  const capabilities = modelInfo?.capabilities ?? []
  const parameterSize = details.parameter_size || modelInfo?.model_info?.['general.parameter_count']
  const quantization = details.quantization_level
  const family = details.family

  return (
    <div className="model-details">
      <Typography variant="subtitle2">{model}</Typography>
      <Stack direction="row" flexWrap="wrap" gap={0.75}>
        {family && <Chip size="small" label={family} />}
        {parameterSize && <Chip size="small" label={`${parameterSize}`} />}
        {quantization && <Chip size="small" label={quantization} />}
        {capabilities.map(capability => (
          <Chip key={capability} size="small" color="primary" variant="outlined" label={capability} />
        ))}
      </Stack>
    </div>
  )
}
