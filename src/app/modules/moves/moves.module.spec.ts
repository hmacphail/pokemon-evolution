import { MovesModule } from './moves.module';

describe('MovesModule', () => {
  let movesModule: MovesModule;

  beforeEach(() => {
    movesModule = new MovesModule();
  });

  it('should create an instance', () => {
    expect(movesModule).toBeTruthy();
  });
});
